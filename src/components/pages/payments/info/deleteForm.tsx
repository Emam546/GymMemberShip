import { DangerButton } from "@src/components/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DeleteDialog from "@src/components/common/AlertDialog";
import { useRouter } from "next/router";
import requester from "@src/utils/axios";
import queryClient from "@src/queryClient";

export default function DeletePaymentForm({
  payment,
}: {
  payment: DataBase.WithId<DataBase.Models.Payments>;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteAccountMutate = useMutation({
    mutationFn: async () => {
      await requester.delete(`/api/admin/payments/${payment._id}`);
      queryClient.invalidateQueries(["payments"]);
      alert("document deleted successfully");
      await router.push(`/users/${payment._id}`);
    },
    onSuccess() {},
  });

  return (
    <div>
      <div className="tw-flex tw-justify-between">
        <p className="tw-text-neutral-500 tw-text-base">
          Once you delete the payment, it cannot be undone. This is permanent.
        </p>
        <DangerButton type="button" onClick={() => setOpen(true)}>
          Delete Payment
        </DangerButton>
      </div>
      <DeleteDialog
        data={{
          accept: "Delete",
          title: "Are you sure you want to delete the payment?",
          desc: `Once you click delete, the payment and associated data
                        will be permanently deleted and cannot be restored.
                        Alternatively if you keep your free payment, the next
                        time you want to edit or update your data you won'
                        t have to start from scratch.`,
          deny: "Keep The payment",
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
