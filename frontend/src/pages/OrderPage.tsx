import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("menu.pipeline")}</h1>
      <p>这里是订单管理页面，未来会展示订单列表和相关操作。</p>
    </div>
  );
}
