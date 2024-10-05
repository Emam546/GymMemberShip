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
      "users:deleteForm": {
        paragraph: "Once you delete your account, it cannot be undone, This is permanent.";
        "Delete Account": "Delete Account";
        model: {
          accept: "Delete";
          title: "Are you sure you want to delete the account?";
          desc: "Once you click delete, the account and associated data  will be permanently deleted and cannot be restored. Alternatively if you keep your free account, the next time you want to edit or update your data you won't have to start from scratch.";
          deny: "Keep The Account";
        };
      };
    }
  }
}
export default function DeleteAccountForm({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("users:deleteForm");
  const deleteAccountMutate = useMutation({
    mutationFn: async () => {
      await requester.delete(`/api/admin/users/${id}`);
      queryClient.invalidateQueries(["users"]);
      alert("document deleted successfully");
      await router.push("/users");
    }
  });

  return (
    <div>
      <div className="tw-flex tw-justify-between">
        <p className="text-muted tw-text-base">{t("paragraph")}</p>
        <DangerButton type="button" onClick={() => setOpen(true)}>
          {t("Delete Account")}
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
i18n.addLoadUrl("/components/users/deleteForm", "users:deleteForm");
