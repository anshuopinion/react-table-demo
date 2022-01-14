import {
  Button,
  Center,
  Heading,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
const url = "https://fakestoreapi.com/products";

const tableColumn = [
  {
    Header: "Not Yet Changed",
    columns: [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Category",
        accessor: "category",
      },
    ],
  },
  {
    Header: "Changed",
    columns: [
      {
        Header: "Product Image",
        accessor: "image",
        Cell: ({ row }) => <Image src={row.values.image} h={100} />,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ row }) => ` $${row.values.price}`,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <Button size="sm" onClick={() => alert(`$${row.values.price}`)}>
            Show Price
          </Button>
        ),
      },
    ],
  },
];

const App = () => {
  const [products, setProducts] = useState([]);
  const columns = useMemo(() => tableColumn, []);
  const data = useMemo(() => products, [products]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
  console.log(products);

  if (products.length === 0)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <>
      <Heading>React Table </Heading>
      <Table variant="striped" colorScheme="orange" {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  {}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);

            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

export default App;
