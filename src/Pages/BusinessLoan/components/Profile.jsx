import React from "react";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";
const Profile = () => {
  const { t } = useLocale();
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
        <h5>{t("PROFILE_TITLE")}</h5>
        <span>{t("PROFILE_DESC_1")}</span>
        <span>{t("PROFILE_DESC_2")}</span>
        <span>{t("PROFILE_DESC_3")}</span>
        <span>{t("PROFILE_DESC_4")}</span>
        <span>{t("PROFILE_DESC_5")}</span>
        <span>{t("PROFILE_DESC_6")}</span>
      </div>
    </div>
  );
};

export default Profile;
