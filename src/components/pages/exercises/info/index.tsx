import { useEffect, useState } from "react";
import InfoGetter, { CreateElem } from "@src/components/InsertCommonData";
import { DropDownElem as DropDownOrgElem } from "@src/components/InsertCommonData/Elem";
import DeleteDialog from "@src/components/common/AlertDialog";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";
import Header from "@src/components/common/header";
import { AddButton } from "@src/components/common/inputs/addButton";
import { WorkOutOrgElem, WorkOutElemDoc } from "./workout";
import { useDebounceEffect } from "@src/hooks";
import axios from "axios";
import ErrorShower from "@src/components/common/error";
type Doc = DataBase.Populate.ModelArray<
  DataBase.WithId<DataBase.Models.Exercises>,
  "workoutIds"
>;
export type ExerciseElemTypeDoc = Doc & {
  onData: (v: Doc) => void;
};

const ExerciseElem = CreateElem<DataBase.WithIdOrg<ExerciseElemTypeDoc>>(
  ({ props: { data }, ...props }, ref) => {
    const [title, setTitle] = useState(data.title);
    const [curDel, setCurDel] = useState<WorkOutElemDoc>();
    const { t } = useTranslation("workouts:info");
    const { t: t2 } = useTranslation("workouts:deleteForm");
    const [workouts, setWorkOuts] = useState(data.workoutIds);
    const updateTitle = useMutation({
      mutationFn() {
        return axios.post(`/api/admin/exercises/${data.id}`, {
          title: title,
        });
      },
    });
    const deleteMutate = useMutation({
      async mutationFn(id: string) {
        const newWorkouts = workouts.filter((val) => val?._id != id);
        await requester.delete(
          `/api/admin/exercises/${data.id}/workouts/${id}`
        );
        await requester.post(`/api/admin/exercises/${data.id}`, {
          workoutIds: newWorkouts.map((val) => val?._id),
        });
        return newWorkouts;
      },
      onSuccess(newWorkouts) {
        setWorkOuts(newWorkouts);
        setCurDel(undefined);
      },
    });
    useEffect(() => {
      data.onData({ ...data, workoutIds: workouts });
    }, [workouts]);

    const resortMutate = useMutation({
      async mutationFn(indexes: number[]) {
        const newWorkouts = indexes
          .map((i) => workouts[i])
          .filter((val) => val != undefined);
        await requester.post(`/api/admin/exercises/${data.id}`, {
          workoutIds: newWorkouts.map((val) => val?._id),
        });
        return newWorkouts as ExerciseElemTypeDoc["workoutIds"];
      },
      onSuccess(data) {
        setWorkOuts(data);
      },
    });
    const createWorkOut = useMutation({
      async mutationFn() {
        const workout = await axios.post(
          `/api/admin/exercises/${data.id}/workouts`,
          {
            title: t("new"),
            hide: true,
            steps: [],
          }
        );
        await requester.post(`/api/admin/exercises/${data.id}`, {
          workoutIds: [
            ...workouts.map((val) => val?._id),
            workout.data.data._id,
          ],
        });
        return workout.data.data;
      },
      onSuccess(data) {
        setWorkOuts((pre) => [...pre, data]);
      },
    });
    useDebounceEffect(
      () => {
        updateTitle.mutate();
      },
      1000,
      [title]
    );
    return (
      <>
        <DropDownOrgElem
          headLabel={
            <Header
              value={title}
              onChange={(e) => {
                data.onData({ ...data, title: e.currentTarget.value });
                setTitle(e.currentTarget.value);
              }}
            />
          }
          {...props}
          ref={ref}
        >
          <div className="tw-px-4 tw-my-2">
            <InfoGetter
              Elem={WorkOutOrgElem}
              data={workouts
                .filter((val) => val != undefined)
                .map<DataBase.WithIdOrg<WorkOutElemDoc>>((plan, i) => ({
                  ...plan,
                  id: plan._id,
                  exerciseId: data.id,
                  onData(v) {
                    setWorkOuts((pre) => {
                      pre[i] = v;
                      return pre;
                    });
                  },
                }))}
              onDeleteElem={(elem) => setCurDel(elem)}
              onResort={resortMutate.mutateAsync}
            />
          </div>
          <AddButton
            label={t("add")}
            disabled={createWorkOut.isLoading}
            onClick={() => {
              createWorkOut.mutate();
            }}
          />
        </DropDownOrgElem>
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
        <ErrorShower
          error={
            updateTitle.error ||
            resortMutate.error ||
            deleteMutate.error ||
            createWorkOut.error
          }
        />
      </>
    );
  }
);

export interface Props {
  exercises: Doc[];
  setExercises: (plans: Doc[]) => void;
}
export default function ExercisesInfoGetter({
  exercises: exercises,
  setExercises: setExercises,
}: Props) {
  const [curDel, setCurDel] = useState<ExerciseElemTypeDoc>();
  const { t } = useTranslation("exercises:info");
  const { t: t2 } = useTranslation("exercises:deleteForm");

  const deleteMutate = useMutation({
    async mutationFn(id: string) {
      await requester.delete(`/api/admin/exercises/${id}`);
    },
    onSuccess(_, id) {
      setExercises(exercises.filter((val) => val._id != id));
      setCurDel(undefined);
    },
  });
  const resortMutate = useMutation({
    async mutationFn(indexes: number[]) {
      return Promise.all(
        indexes.map(async (i) => {
          const val = exercises[i];
          exercises[i].order = i;
          await requester.post(`/api/admin/exercises/${val._id}`, { order: i });
          return exercises[i];
        })
      );
    },
    onSuccess(data) {
      setExercises(data);
    },
  });
  return (
    <>
      <>
        {exercises.length > 0 && (
          <InfoGetter
            Elem={ExerciseElem}
            data={exercises.map<DataBase.WithIdOrg<ExerciseElemTypeDoc>>(
              (plan) => ({
                ...plan,
                id: plan._id,
                onData(v) {
                  setExercises(
                    exercises.map((g) => {
                      if (g._id == v._id) return { ...g, ...v };
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
        {exercises.length == 0 && <p className="tw-mb-0">{t("NoData")}</p>}
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
      "exercises:info": {
        NoData: "There is no plans so far please add some plans";
        add: "Add a new workOut";
        new: "New Exercise";
      };
      "exercises:deleteForm": {
        title: "Delete Level";
        desc: "Once you click delete, The Level and associated data will be permanently deleted and cannot be restored.";
        accept: "Delete {{name}} Plan";
        deny: "Keep";
      };
    }
  }
}
