import { useState } from "react";
import InfoGetter, { CreateElem } from "@src/components/InsertCommonData";
import { DropDownElem as DropDownOrgElem } from "@src/components/InsertCommonData/Elem";
import DeleteDialog from "@src/components/common/AlertDialog";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Header from "@src/components/common/header";
import { FilesElem, WorkOutElemDoc } from "./file";
import { useDebounceEffect } from "@src/hooks";
import ErrorShower from "@src/components/common/error";
import TextArea from "@src/components/common/inputs/textArea";
import { FileInput, WrapElem } from "@src/components/common/inputs/styles";
import requester from "@src/utils/axios";

type Doc = DataBase.WithId<DataBase.Models.Workouts["steps"][0]>;

export type ExerciseElemTypeDoc = Doc & {
  onData: (v: Doc, i: number) => void;
};

const ExerciseElem = CreateElem<DataBase.WithIdOrg<ExerciseElemTypeDoc>>(
  ({ index, props: { data }, ...props }, ref) => {
    const [title, setTitle] = useState(data.title);
    const [desc, setDesc] = useState(data.desc);
    const [curDel, setCurDel] = useState<WorkOutElemDoc>();
    const { t } = useTranslation("step:info");
    const { t: t2 } = useTranslation("file:deleteForm");
    const [files, setFiles] = useState(data.files);
    const updateData = useMutation({
      async mutationFn() {
        await data.onData({ ...data, title, desc }, index);
      },
    });
    const deleteMutate = useMutation({
      async mutationFn(id: string) {
        const file = files.find((val) => val == id);
        if (!file) return files;
        try {
          await requester.delete(`/api/admin/uploads/${file}`);
        } catch (error) {}
        const newFiles = files.filter((val) => val != id);
        await data.onData({ ...data, files: newFiles }, index);
        return newFiles;
      },
      onSuccess(data) {
        setFiles(data);
        setCurDel(undefined);
      },
    });
    const resortMutate = useMutation({
      async mutationFn(indexes: number[]) {
        const newWorkouts = indexes
          .map((i) => files[i])
          .filter((val) => val != undefined);
        await data.onData({ ...data, title: title }, index);
        return newWorkouts as ExerciseElemTypeDoc["files"];
      },
      onSuccess(data) {
        setFiles(data);
      },
    });
    const createFile = useMutation({
      async mutationFn(fileList: FileList) {
        const formData = new FormData();
        Array.from(fileList).forEach((file, i) => {
          formData.append(i.toString(), file);
        });
        const res = await requester.post<Routes.ResponseSuccess<string[]>>(
          "/api/admin/uploads",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        await data.onData(
          {
            ...data,
            files: [...files, ...res.data.data],
          },
          index
        );
        return res.data.data;
      },
      onSuccess(data) {
        setFiles((pre) => [...pre, ...data]);
      },
    });
    useDebounceEffect(
      () => {
        updateData.mutate();
      },
      1000,
      [title, desc]
    );

    return (
      <>
        <DropDownOrgElem
          headLabel={
            <Header
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
          }
          {...props}
          ref={ref}
        >
          <div className="tw-px-4 tw-my-2">
            <InfoGetter
              Elem={FilesElem}
              data={files
                .filter((val) => val != undefined)
                .map<DataBase.WithIdOrg<WorkOutElemDoc>>((plan, i) => ({
                  url: plan,
                  id: plan,
                  async onData(v) {
                    setFiles((pre) => {
                      pre[i] = v.url;
                      return pre;
                    });
                    await data.onData(
                      {
                        ...data,
                        files: files,
                      },
                      index
                    );
                  },
                }))}
              onDeleteElem={(elem) => setCurDel(elem)}
              onResort={resortMutate.mutateAsync}
            />
          </div>
          <WrapElem label={t("files.label")} id="files-input">
            <FileInput
              id="files-input"
              disabled={createFile.isLoading}
              accept="image/*, video/*"
              onChange={async (e) => {
                if (!e.currentTarget.files) return;
                await createFile.mutateAsync(e.currentTarget.files);
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (e.target as any).value = null;
                } catch (ex) {}
                if (e.target.value) {
                  e.target.parentNode?.replaceChild(
                    e.target.cloneNode(true),
                    e.target
                  );
                }
              }}
            />
          </WrapElem>
          <div className="tw-mt-3">
            <TextArea
              value={desc}
              onChange={(e) => {
                setDesc(e.currentTarget.value);
              }}
              title={t("desc")}
              id={"desc-input"}
            />
          </div>
        </DropDownOrgElem>
        <DeleteDialog
          onAccept={async () => {
            if (!curDel) return;
            await deleteMutate.mutateAsync(curDel.url);
          }}
          onClose={function () {
            setCurDel(undefined);
          }}
          submitting={deleteMutate.isLoading}
          open={curDel != undefined}
          data={{
            title: t2("title"),
            desc: t2("desc"),
            accept: t2("accept", { name: curDel?.url }),
            deny: t2("deny"),
          }}
        />
        <ErrorShower
          error={
            updateData.error ||
            resortMutate.error ||
            deleteMutate.error ||
            createFile.error
          }
        />
      </>
    );
  }
);

export interface Props {
  workouts: Doc[];
  setSteps: (steps: Doc[]) => void;
}
export default function StepsInfoGetter({
  workouts: steps,
  setSteps: setSteps,
}: Props) {
  const [curDel, setCurDel] = useState<Doc>();
  const { t } = useTranslation("step:info");
  const { t: t2 } = useTranslation("step:deleteForm");

  const deleteMutate = useMutation({
    async mutationFn(id: string) {
      const step = steps.find((val) => val._id == id);
      if (!step) return;
      await Promise.all(
        step.files.map(async (val) => {
          try {
            await requester.delete(`/api/admin/uploads/${val}`);
          } catch (error) {}
        })
      );
      return setSteps(steps.filter((val) => val._id != id));
    },
    onSuccess() {
      setCurDel(undefined);
    },
  });
  const resortMutate = useMutation({
    async mutationFn(indexes: number[]) {
      return setSteps(
        indexes.map((i) => {
          return steps[i];
        })
      );
    },
  });
  return (
    <>
      <>
        {steps.length > 0 && (
          <InfoGetter
            Elem={ExerciseElem}
            data={steps.map<DataBase.WithIdOrg<ExerciseElemTypeDoc>>(
              (plan) => ({
                ...plan,
                id: plan._id,
                onData(v) {
                  return setSteps(
                    steps.map((g) => {
                      if (v._id == g._id) return { ...g, ...v };
                      return g;
                    })
                  );
                },
              })
            )}
            onDeleteElem={(elem) => setCurDel(elem)}
            onResort={resortMutate.mutateAsync}
          />
        )}
        {steps.length == 0 && <p className="tw-mb-0">{t("NoData")}</p>}
      </>

      <DeleteDialog
        onAccept={async () => {
          if (!curDel) return;
          await deleteMutate.mutateAsync(curDel._id);
        }}
        onClose={function () {
          setCurDel(undefined);
        }}
        submitting={deleteMutate.isLoading}
        open={curDel != undefined}
        data={{
          title: t2("title"),
          desc: t2("desc"),
          accept: t2("accept", { name: curDel?.title }),
          deny: t2("deny"),
        }}
      />
    </>
  );
}
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "step:info": {
        NoData: "There is no plans so far please add some plans";
        add: "Add a new file";
        files: {
          label: "add new File";
        };
        desc: "Description";
        new: "New Exercise";
      };
      "step:deleteForm": {
        title: "Delete Level";
        desc: "Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.";
        accept: "Delete {{name}} Plan";
        deny: "Keep";
      };
    }
  }
}
