import { CreateElem } from "@src/components/InsertCommonData";
import { Elem as OrgElem } from "@src/components/InsertCommonData/Elem";
import mime from "mime-types";
export type WorkOutElemDoc = {
  url: string;
  onData: (v: DataBase.WithIdOrg<WorkOutElemDoc>) => void;
};
export const FilesElem = CreateElem<DataBase.WithIdOrg<WorkOutElemDoc>>(
  ({ props: { data }, ...props }, ref) => {
    // const { t } = useTranslation("file:info");
    const state = mime.lookup(data.url);
    console.log(data.url);
    const url = `/uploads/${data.url}`;
    if (!state) return null;
    console.log(state);
    return (
      <>
        <OrgElem {...props} ref={ref}>
          <div className="tw-py-2 tw-flex tw-justify-center">
            {state.startsWith("image") ? (
              <a href={url} target="_blank">
                <img
                  className="tw-max-w-full tw-max-h-60"
                  src={url}
                  alt={data.url}
                />
              </a>
            ) : state.startsWith("video") ? (
              <video className="tw-max-h-60 tw-max-w-full" src={url} controls />
            ) : (
              <a href={url} target="_blank">
                <p className="tw-mb-0">{url}</p>
              </a>
            )}
          </div>
        </OrgElem>
      </>
    );
  }
);
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "file:info": {
        NoData: "There is no Files so far please add some Files";
      };
      "file:deleteForm": {
        title: "Delete Level";
        desc: "Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.";
        accept: "Delete {{name}} Plan";
        deny: "Keep";
      };
    }
  }
}
