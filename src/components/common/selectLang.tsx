import i18n from "@src/i18n";
import { ObjectEntries } from "@src/utils";
import router from "next/router";
import { StyledSelect } from "./inputs/styles";
const langs: Record<I18ResourcesType.AvailableLang, string> = {
  ar: "العربيه",
  en: "English",
};
export function SelectLang() {
  return (
    <StyledSelect
      onChange={async (e) => {
        await i18n.changeLanguageAndLoad(e.currentTarget.value);
      }}
      id={"choose lang"}
      value={i18n.language}
    >
      {ObjectEntries(langs).map(([key, label]) => {
        return (
          <option value={key} key={key}>
            {label}
          </option>
        );
      })}
    </StyledSelect>
  );
}
