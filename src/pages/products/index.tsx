import { BigCard, CardTitle, MainCard } from "@src/components/card";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import requester from "@src/utils/axios";
import { useTranslation } from "react-i18next";
import { GetServerSideProps } from "next";
import { useState } from "react";
import EnvVars from "@serv/declarations/major/EnvVars";
import connect from "@serv/db/connect";
import { useAuth, useLogUser } from "@src/components/UserProvider";
import ProductsTable from "@src/components/pages/products/table";
import { getProducts } from "@serv/routes/admin/products";
import ProductInfoForm from "@src/components/pages/products/form";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
interface Props {
  products: DataBase.WithId<DataBase.Models.Products>[];
}
export default function Page({ products: initProducts }: Props) {
  const [products, setProducts] = useState(initProducts);
  const { t } = useTranslation("/products");
  const mutate = useMutation({
    async mutationFn(data: unknown) {
      const request = await requester.post<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Products>>
      >(`/api/admin/products`, data);
      return request.data.data;
    },
    onSuccess(data) {
      setProducts([...products, data]);
      alert(t("messages.added", { ns: "translation" }));
    },
  });

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <RedirectIfNotAdmin>
        <BigCard>
          <CardTitle>{t("create.title")}</CardTitle>
          <MainCard>
            <ProductInfoForm
              onData={async (data) => {
                await mutate.mutateAsync(data);
              }}
              buttonName={t("buttons.add", { ns: "translation" })}
            />
          </MainCard>
          <MainCard>
            <ProductsTable
              perPage={products.length}
              page={0}
              products={products.map((product, i) => {
                return {
                  order: i,
                  product: product,
                };
              })}
              onUpdate={async (product, data) => {
                await requester.post<
                  Routes.ResponseSuccess<
                    DataBase.WithId<DataBase.Models.Products>
                  >
                >(`/api/admin/products/${product._id}`, data);
                setProducts((pre) => {
                  const i = pre.findIndex((c) => c._id == product._id);
                  pre[i] = { ...pre[i], ...data };
                  return [...pre];
                });
              }}
              onDelete={async (product) => {
                await requester.delete<
                  Routes.ResponseSuccess<
                    DataBase.WithId<DataBase.Models.Products>
                  >
                >(`/api/admin/products/${product._id}`);
                setProducts((pre) => pre.filter((c) => c._id != product._id));
              }}
              totalCount={products.length}
              headKeys={["delete", "name", "order", "amount", "price"]}
            />
          </MainCard>
        </BigCard>
      </RedirectIfNotAdmin>
    </>
  );
}

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/products": {
        title: "Products";
        "create.title": "Create Product";
      };
    }
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  await connect(EnvVars.mongo.url);
  const products = await getProducts();
  return {
    props: {
      products: products.map((product) => {
        return {
          ...product.toJSON(),
          _id: product._id.toString(),
        };
      }),
    },
  };
};
