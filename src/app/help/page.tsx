import styles from "./help.module.css";
export default function HelpPage() {
  return (
    <>
      <section className={styles.general_description}>
        <p className={styles.button_p}>Searching tutorial</p>
        <p className={styles.description}>
          To show your mastery chart you need to enter your nickname and tag.
          When you never changed nickname your tag is possible to be default,
          (you still need to enter default tag into input) for example: #EUNE or
          #EUW this is default tags according to your server.
        </p>
        <p className={styles.button_p}>Buttons type</p>
        <ul className={styles.description}>
          <li>
            <strong>Explode Mode</strong>
            <p>
              This button changes your cursor into something like a bomb. After
              clicking anywhere on the chart, you will see bubbles flying away.
              Additionally, this button resets the chart to its default view.
            </p>
          </li>
          <li>
            <strong>Dispersion Button</strong>
            <p>This button scatters the bubbles all over the area.</p>
          </li>
          <li>
            <strong>Sort Button</strong>
            <p>
              This button sorts the bubbles from those with the most mastery
              points to those with the least.
            </p>
          </li>
          <li>
            <strong>Fight Button</strong>
            <p>
              This button triggers a "fight" between the bubbles. If you
              encounter any issues, you can use this button as a "reset".
            </p>
          </li>
        </ul>
      </section>

      <section className={styles.contact}>
        <p>
          If you have any problem or questions contact details are on my github
          you can click github logo on left down corner
        </p>
      </section>
    </>
  );
}
