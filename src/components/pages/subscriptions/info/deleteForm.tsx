import { DangerButton } from "@src/components/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DeleteDialog from "@src/components/common/AlertDialog";
import { useRouter } from "next/router";
import requester from "@src/utils/axios";
import queryClient from "@src/queryClient";
import { useTranslation } from "react-i18next";
import i18n from "@src/i18n";

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "payments:deleteForm": {
        paragraph: "Once you delete the payment, it cannot be undone. This is permanent.";
        "delete.button": "Delete Payment";
        model: {
          accept: "Delete";
          title: "Are you sure you want to delete the payment?";
          desc: "Once you click delete, the payment and associated data will be permanently deleted and cannot be restored.";
          deny: "Keep The Payment";
        };
      };
    }
  }
}
export default function DeletePaymentForm({
  payment,
}: {
  payment: DataBase.WithId<DataBase.Models.Subscriptions>;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("payments:deleteForm");
  const deleteAccountMutate = useMutation({
    mutationFn: async () => {
      await requester.delete(`/api/admin/subscriptions/${payment._id}`);
      queryClient.invalidateQueries(["payments"]);
      alert(t("messages.added", { ns: "translation" }));
      await router.push(`/users/${payment._id}`);
    },
  });

  return (
    <div>
      <div className="tw-flex tw-justify-between">
        <p className="tw-text-neutral-500 tw-text-base">{t("paragraph")}</p>
        <DangerButton type="button" onClick={() => setOpen(true)}>
          {t("delete.button")}
        </DangerButton>
      </div>
      <DeleteDialog
        data={{
          accept: t("model.accept"),
          title: t("model.title"),
          desc: t("model.desc"),
          deny: t("model.deny"),
        }}
        onAccept={async () => {
          await deleteAccountMutate.mutateAsync();
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        submitting={deleteAccountMutate.isLoading}
      />
    </div>
  );
}
