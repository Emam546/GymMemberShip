import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";
import { GetServerSideProps } from "next";
import { useState } from "react";
import EnvVars from "@serv/declarations/major/EnvVars";
import connect from "@serv/db/connect";
import SellProductsTable, {
  SellProduct,
} from "@src/components/pages/products/sell/table";
import MoneyPaidProductForm, {
  FormData as MoneyPaidProductFormData,
} from "@src/components/pages/products/sell/formPrice";
import { getProductPayment } from "@serv/routes/admin/products/payments/[id]";
import { MakeItSerializable } from "@src/utils";
import { getProduct } from "@serv/routes/admin/products/[id]";
import ProductPaymentInfoForm from "@src/components/pages/products/payments/form";
interface Props {
  payment: DataBase.Populate.Model<
    DataBase.WithId<DataBase.Models.ProductPayments>,
    "adminId" | "userId"
  >;
  sellProducts: (SellProduct | null)[];
}
export default function Page({ payment, sellProducts }: Props) {
  const [curProducts, setCurProducts] = useState<SellProduct[]>(
    sellProducts.filter<SellProduct>((val) => val != null)
  );
  const { t } = useTranslation("/products/payments/[id]");
  const mutate = useMutation({
    async mutationFn(data: MoneyPaidProductFormData) {
      const request = await requester.post(
        `/api/admin/products/payments/${payment._id}`,
        {
          products: curProducts.map((val) => ({
            productId: val._id,
            num: val.curNum,
          })),
          ...data,
        }
      );
      return request.data.data;
    },
    onSuccess() {
      alert(t("messages.added", { ns: "translation" }));
    },
  });
  const totalPrice = curProducts.reduce((acc, val) => {
    return acc + val.curNum * val.price;
  }, 0);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <BigCard>
        <CardTitle>{t("create.title")}</CardTitle>
        <MainCard>
          <ProductPaymentInfoForm
            payment={{
              ...payment,
              adminId: payment.adminId?._id || "",
              userId: payment.userId?._id || "",
            }}
            admin={payment.adminId}
          />
        </MainCard>
        <MainCard>
          <SellProductsTable
            page={0}
            perPage={curProducts.length}
            products={curProducts.map((doc, i) => {
              return {
                order: i,
                product: doc,
              };
            })}
            totalCount={curProducts.length}
            headKeys={[
              "amount",
              "delete",
              "name",
              "order",
              "price",
              "curAmount",
              "perPrice",
            ]}
            onUpdate={function (product, data) {
              setCurProducts((pre) => {
                const i = pre.findIndex((c) => c._id == product._id);
                pre[i] = { ...pre[i], ...data };
                return [...pre];
              });
            }}
            onDelete={(product) => {
              setCurProducts((pre) => pre.filter((c) => c._id != product._id));
            }}
            ignoreWarnings={true}
          />
          <div className="tw-mt-4">
            <MoneyPaidProductForm
              values={{
                paid: payment.paid,
                remaining: payment.remaining,
              }}
              buttonName={t("buttons.update", { ns: "translation" })}
              totalPrice={totalPrice}
              disableAutoUpdating
              onData={async function (data) {
                if (curProducts.length == 0)
                  return alert("Please add some products to sell");
                await mutate.mutateAsync(data);
              }}
            />
          </div>
        </MainCard>
      </BigCard>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);

  try {
    if (!ctx.params?.id)
      return {
        notFound: true,
      };
    const payment = await getProductPayment(ctx.params.id as string);
    return {
      props: {
        payment: MakeItSerializable({
          ...payment.toJSON(),
          _id: payment._id.toString(),
        }) as unknown as Props["payment"],
        sellProducts: await Promise.all(
          payment.products.map(async (val) => {
            try {
              const product = await getProduct(val.productId);
              return MakeItSerializable({
                ...product.toJSON(),
                _id: product._id.toString(),
                curNum: val.num,
              });
            } catch (err) {
              return null;
            }
          })
        ),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/products/payments/[id]": {
        title: "Products";
        "create.title": "Create Product";
      };
    }
  }
}
