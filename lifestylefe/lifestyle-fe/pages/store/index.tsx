import { Delete, Edit } from "@mui/icons-material";
import { Button, Container, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Product } from "../../common/types/Common";
import { BASE_URL } from "../../common/utils/constants";

type Data = {
  products: Product[];
  error: any;
};

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  let response = [];
  let error = {};
  const token = context.req.cookies?.token;
  try {
    const products = await fetch(`${BASE_URL}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const productsList = await products.json();
    response = productsList;
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {
      products: response,
      token,
      error,
    },
  };
};

function Store({ products, token }: { products: Product[], token: string }) {
  const route = useRouter();

  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  const columns: GridColDef[] = [
    { field: "productName", headerName: "Name", width: 100, flex: 2 },
    { field: "price", headerName: "Price", width: 100, flex: 2 },
    { field: "sellingPrice", headerName: "Selling Price", width: 100, flex: 2 },
    { field: "quantity", headerName: "Quantity", width: 100, flex: 2 },
    { field: "sold", headerName: "Sold", width: 100, flex: 2 },
    { field: "productType", headerName: "ProductType", width: 100, flex: 2 },
    {
      field: "delete",
      width: 75,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => {
        return (
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        );
      },
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => route.push(`/store/edit/${params.row.id}`)}
          >
            <Edit />
          </IconButton>
        );
      },
    },
  ];

  const handleDelete = async () => {
    let response = await Promise.allSettled(
      (selectedIds as string[])?.map(async (id) => {
        await fetch(`${BASE_URL}/product/${id}`, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return id;
      })
    );
    // get ids that were deleted
    const deletedIds = response.map((resp) =>
      resp.status === "fulfilled" ? resp.value : ""
    );
    // filter available durations
    const updated = allProducts.filter(
      (item) => !deletedIds.includes(item.id!)
    );
    setAllProducts(updated);
  };


  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0 0 10px 0",
        }}
      >
        <Button variant="contained" onClick={() => route.push("/store/sell")}>
          SELL PRODUCT
        </Button>
        <Button variant="contained" onClick={() => route.push("/store/add")}>
          ADD PRODUCT
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={allProducts}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onSelectionModelChange={(ids) => setSelectedIds(ids)}
        />
      </div>
    </Container>
  );
}

export default Store;
