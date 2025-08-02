import { Paper, Image } from "@mantine/core";
import styles from './About.module.css';

export const About = () => {
  return (
    <Paper p="sm">
      <h1>About This Application</h1>
      <p>This application is designed to simulate the spread of a virus through a population.</p>
      <p>It uses WebR to run R code in the browser, allowing for interactive data analysis and visualization.</p>
      <p>For more information, visit the project's GitHub repository.</p>
      <p>Data modeling done by Ka Yin Leung; Web application development by John Fisher.</p>
      <div className={styles.aboutImages}>
        <Image
          src="./Kayin.webp"
          className={styles.aboutImage}
          alt="Ka Yin Leung"
        />
        <Image
          src="./John.webp"
          className={styles.aboutImage}
          alt="John Fisher"
        />
      </div>
    </Paper>
  );
};
