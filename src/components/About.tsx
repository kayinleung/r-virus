import { Paper, Image } from "@mantine/core";
import styles from './About.module.css';

export const About = () => {
  return (
    <Paper shadow="xs" className={styles.about} p="sm">
      <p>This application is designed to simulate the spread of a virus through a population. It uses WebR to run R code in the browser, allowing for interactive data analysis and visualization.</p>
      <p>Data science development and data modeling done by <a href="https://www.linkedin.com/in/kayinleung/">Ka Yin Leung</a>; Web application development by <a href="https://www.linkedin.com/in/jgf5013/">John Fisher</a>.</p>
      <div className={styles.aboutImages}>
        <Image
          src="./Kayin.webp"
          className={styles.aboutImage}
          alt="Ka Yin Leung"
          onClick={() => window.open("https://www.linkedin.com/in/kayinleung/", "_blank")}
        />
        <Image
          src="./John.webp"
          className={styles.aboutImage}
          alt="John Fisher"
          onClick={() => window.open("https://www.linkedin.com/in/jgf5013/", "_blank")}
        />
      </div>
      <p>For more information, visit the project's GitHub repositories at <a href="https://github.com/jgf5013/r-virus">r-virus</a> and <a href="https://github.com/jgf5013/escape2024">escape2024</a>.</p>
    </Paper>
  );
};
