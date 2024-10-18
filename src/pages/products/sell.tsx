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
import ProductInfoForm from "@src/components/pages/products/sell";
import { RedirectIfNotAdmin } from "@src/components/wrappers/redirect";
import SellProductsTable, {
  SellProduct,
} from "@src/components/pages/products/sell/table";
import MoneyPaidProductForm, {
  FormData as MoneyPaidProductFormData,
} from "@src/components/pages/products/sell/formPrice";
interface Props {
  products: DataBase.WithId<DataBase.Models.Products>[];
}
export default function Page({ products: initProducts }: Props) {
  const [products, setProducts] = useState(initProducts);
  const [curProducts, setCurProducts] = useState<SellProduct[]>([]);
  const { t } = useTranslation("/products/sell");
  const mutate = useMutation({
    async mutationFn(data: MoneyPaidProductFormData) {
      const request = await requester.post(`/api/admin/products/payments`, {
        products: curProducts.map((val) => ({
          productId: val._id,
          num: val.curNum,
        })),
        ...data,
      });
      return request.data.data;
    },
    async onSuccess() {
      setCurProducts([]);
      const products = await requester.get<
        Routes.ResponseSuccess<DataBase.WithId<DataBase.Models.Products>[]>
      >("/api/admin/products");
      setProducts(products.data.data);
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
          <ProductInfoForm
            onData={async (data) => {
              console.log(data);
              const product = products.find((v) => v._id == data.productId);
              if (!product) return;
              if (curProducts.some((id) => id._id == data.productId))
                return alert("the product is already added");
              setCurProducts((pre) => [...pre, { ...product, curNum: 1 }]);
            }}
            products={products.filter(
              (val) => !curProducts.some((id) => id._id == val._id)
            )}
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
          />
          <div className="tw-mt-4">
            <MoneyPaidProductForm
              buttonName={t("buttons.add", { ns: "translation" })}
              totalPrice={totalPrice}
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

declare global {
  namespace I18ResourcesType {
    interface Resources {
      "/products/sell": {
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
