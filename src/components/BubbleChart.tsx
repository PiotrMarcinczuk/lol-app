import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./bubble_chart.module.css";

const championBaseUrl =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons";

interface BubbleChartProps {
  data: any[];
  nickname: string;
  tag: string;
}

interface CustomSimulationNodeDatum extends d3.SimulationNodeDatum {
  championId: number;
  championPoints: number;
  radius: number;
  showText: boolean;
}

export default function BubbleChart({ data, nickname, tag }: BubbleChartProps) {
  const explodeButtonRef = useRef<HTMLButtonElement | null>(null);
  const fightButtonRef = useRef<HTMLButtonElement | null>(null);
  const randomMoveButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);
  const [explodeFlag, setExplodeFlag] = useState(false);
  const dataLen = data.length;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 800;
  const height = 380;

  const calculateSize = (championPoints: number) => {
    const minPoints = 12000; // Minimum points to consider
    const maxPoints = 5000000; // Maximum points to consider
    const minRadius = 5; // Minimum bubble radius
    const maxRadius = 40; // Maximum bubble radius

    // Create a logarithmic scale for champion points
    const sizeScale = d3
      .scaleLog()
      .domain([minPoints, maxPoints])
      .range([minRadius, maxRadius]);

    return sizeScale(championPoints);
  };

  const calculateFontSize = (radius: number) => {
    const minFontSize = 2; // Minimum font size
    const maxFontSize = 20; // Maximum font size

    // Create a linear scale for font size
    const fontSizeScale = d3
      .scaleLinear()
      .domain([5, 40])
      .range([minFontSize, maxFontSize]);

    return `${fontSizeScale(radius)}px`;
  };

  const convertNumber = (number: number) => {
    return number.toLocaleString("en-US");
  };

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("class", styles.svg);
    svg.selectAll("*").remove();

    if (dataLen === 0) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(
          "When you see this message, probably you have no champions with 12000+ points."
        );
      return;
    }

    const defs = svg.append("defs");
    data.forEach((d) => {
      const radius = calculateSize(d.championPoints); // Calculate radius based on champion points
      const pattern = defs
        .append("pattern")
        .attr("id", `pattern${d.championId}`)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1);

      pattern
        .append("image")
        .attr("xlink:href", `${championBaseUrl}/${d.championId}.png`)
        .attr("width", radius * 2)
        .attr("height", radius * 2)
        .attr("x", 0)
        .attr("y", 0)
        .attr("preserveAspectRatio", "xMidYMid slice");
    });

    const ticking = () => {
      svg
        .selectAll<SVGCircleElement, any>("circle")
        .data(simulationData)
        .join("circle")
        .attr("r", (d) => d.radius) // Use the pre-calculated radius
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!)
        .attr("cursor", "pointer")
        .attr("fill", (d) =>
          d.showText ? "white" : `url(#pattern${d.championId})`
        )
        .attr("style", "stroke: #41c6f2")
        .call(drag)
        .on("click", (event, d) => {
          if (explodeFlag) return;
          d.showText = !d.showText; // Toggle the showText property
          d3.select(event.target).attr(
            "fill",
            d.showText ? "white" : `url(#pattern${d.championId})`
          );
        });
      svg
        .selectAll("text")
        .data(simulationData)
        .join("text")
        .attr("x", (d) => d.x!)
        .attr("y", (d) => d.y!)
        .attr("dy", ".3em")
        .attr("font-size", (d) => calculateFontSize(d.radius))
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text((d) => (d.showText ? convertNumber(d.championPoints) : ""));
    };

    const drag = d3
      .drag<SVGCircleElement, any>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.05).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.2);
        setTimeout(() => {
          simulation.alphaTarget(0.01);
        }, 2000);
        d.fx = null;
        d.fy = null;
      });

    const simulationData: CustomSimulationNodeDatum[] = data.map((d) => ({
      ...d,
      radius: calculateSize(d.championPoints), // Calculate radius based on champion points
      x: width / 2,
      y: height / 2,
      showText: false,
    }));

    const simulation = d3
      .forceSimulation(simulationData)
      .force("charge", d3.forceManyBody().strength(3)) // Increase the strength of charge to attract more to the center
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<CustomSimulationNodeDatum>().radius((d) => d.radius)
      )
      .force("x", d3.forceX(width / 2).strength(dataLen > 10 ? 0.035 : 0.09)) // Additional force to push towards the center on x-axis
      .force("y", d3.forceY(height / 2).strength(dataLen > 10 ? 0.035 : 0.09)) // Additional force to push towards the center on y-axis
      .alphaDecay(0.02) // Increase alpha decay for faster stabilization
      .on("tick", ticking);

    svg
      .selectAll<SVGCircleElement, CustomSimulationNodeDatum>("circle")
      .call(drag);

    const explode = (clickX: number, clickY: number) => {
      const explosionStrength = 50;

      simulation.force(
        "explode",
        d3.forceManyBody().strength((d) => {
          const dx = d.x! - clickX;
          const dy = d.y! - clickY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = explosionStrength / (distance + 1); // Prevent division by zero
          d.vx! += force * dx;
          d.vy! += force * dy;
          return force;
        })
      );
      simulation.alpha(0.5).restart();

      setTimeout(() => {
        simulation.force("explode", null); // Remove the explosion force after some time
      }, 1000);
    };

    const pullToCenter = () => {
      simulation
        .force(
          "x",
          d3.forceX(width / 2).strength(0.5) // Adjust strength as needed
        )
        .force(
          "y",
          d3.forceY(height / 2).strength(0.5) // Adjust strength as needed
        )
        .alpha(1)
        .restart();
      setTimeout(() => {
        console.log("Simulation stopped");
        simulation
          .force(
            "x",
            d3.forceX(width / 2).strength(dataLen > 10 ? 0.035 : 0.09)
          )
          .force(
            "y",
            d3.forceY(height / 2).strength(dataLen > 10 ? 0.035 : 0.09)
          )
          .alphaTarget(0.2);
      }, 1000);
    };

    const randomMove = () => {
      const randomStrength = 0.15;
      simulation
        .force(
          "randomX",
          d3.forceX().strength(() => (Math.random() - 0.5) * randomStrength)
        )
        .force(
          "randomY",
          d3.forceY().strength(() => (Math.random() - 0.3) * randomStrength)
        )
        .alpha(0.5)
        .restart();

      setTimeout(() => {
        simulation.force("randomX", null).force("randomY", null);
      }, 2000);
    };

    const sort = () => {
      let value = 100;
      if (dataLen > 90) value = 150;
      if (dataLen > 150) value = 200;
      simulation
        .force("x", null)
        .force("y", null)
        .force(
          "sort",
          d3.forceX((d, i) => (i + 1) * (width / value)).strength(0.8)
        )
        .force("centerY", d3.forceY(height / 2).strength(0.5))
        .alpha(1)
        .restart();
    };

    const handleExplosion = () => {
      setExplodeFlag((prev) => !prev);
    };

    const handleFight = () => {
      pullToCenter();
    };

    const handleRandomMove = () => {
      randomMove();
    };

    const handleSort = () => {
      sort();
    };

    if (explodeButtonRef.current) {
      explodeButtonRef.current.addEventListener("click", handleExplosion);
    }

    if (explodeFlag) {
      svg.on("click", (event) => {
        const [clickX, clickY] = d3.pointer(event);
        explode(clickX, clickY);
      });
    } else {
      svg.on("click", null);
    }

    if (fightButtonRef.current) {
      fightButtonRef.current.addEventListener("click", handleFight);
    }

    if (randomMoveButtonRef.current) {
      randomMoveButtonRef.current.addEventListener("click", handleRandomMove);
    }

    if (sortButtonRef.current) {
      sortButtonRef.current.addEventListener("click", handleSort);
    }

    return () => {
      if (explodeButtonRef.current) {
        explodeButtonRef.current.removeEventListener("click", handleExplosion);
      }
      if (fightButtonRef.current) {
        fightButtonRef.current.removeEventListener("click", handleFight);
      }
      if (randomMoveButtonRef.current) {
        randomMoveButtonRef.current.removeEventListener(
          "click",
          handleRandomMove
        );
      }
      if (sortButtonRef.current) {
        sortButtonRef.current.removeEventListener("click", handleSort);
      }
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [data, nickname, tag, explodeFlag]);

  return (
    <div className={styles.chart_container}>
      <svg ref={svgRef}></svg>
      <div className={styles.button_section}>
        <button
          className={`
            ${styles.click_button} ${explodeFlag ? styles.on : styles.off}`}
          ref={explodeButtonRef}
        >
          Explode MODE
        </button>
        <button className={styles.click_button} ref={randomMoveButtonRef}>
          Dispersion Button
        </button>
        <button className={styles.click_button} ref={sortButtonRef}>
          Sort Button
        </button>
        <button className={styles.click_button} ref={fightButtonRef}>
          Fight Button
        </button>
      </div>
    </div>
  );
}
