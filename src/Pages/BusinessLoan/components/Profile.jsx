import React from "react";
import styles from "../styles.module.scss";
const Profile = () => {
  return (
    <div className={styles.profileContent}>
      <img
        src="https://www.ponture.com/wp-content/uploads/2019/04/Kim.jpg"
        alt=""
      />
      <div className={styles.profileContent__username}>
        Kim Rundkvist tipsar
      </div>
      <div className={styles.profileContent__info}>
        <h5>Så här ansöka du om företagslån hos oss</h5>
        <span>1. Fyll i det här förmularät.</span>
        <span>2. Vi genomför en sök mellan 20+ banker och långivare</span>
        <span>
          3. Du får erbjudanden i ditt konto hos oss Vi kommer att maila och
          SMSa igenom processen.
        </span>
        <span>
          Du kan jämföra och gå vidare med erbjudandet som passar dig bäst på
          ditt konto hos oss.
        </span>
        <span>
          I vissa fall kommer vi att kontakta dig för att ta in mer information
          som behövs.
        </span>
        <span>Kontakta mig om du vill ha mer hjälp.</span>
      </div>
    </div>
  );
};

export default Profile;
