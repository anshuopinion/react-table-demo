import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    nextPage,
    prevPage,
    pageCount,
    pageOptions,
    setPageSize,
    canPreviousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1 },
    },

    useSortBy,
    usePagination
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
          {page.map((row, i) => {
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
      <Flex justify="space-between" m={4} align="center">
        <Flex gap="4">
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h="3" w="3" />}
            />
          </Tooltip>
          <Tooltip label="Prev Page">
            <IconButton
              onClick={prevPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h="3" w="3" fontSize="xl" />}
            />
          </Tooltip>
        </Flex>

        <Flex align="center" gap={4}>
          <Flex align="center" gap="2">
            Page{" "}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>
            of
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Flex>

          <Flex align="center" gap={4}>
            Goto Page{" "}
            <NumberInput
              w={28}
              min={1}
              max={pageOptions.length}
              onChange={(value) => {
                const page = value ? value - 1 : 0;
                gotoPage(page);
              }}
              defaultValue={pageIndex + 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>

          <Select
            w="32"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15, 20, 25, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex gap="4">
          <Tooltip label="Next Page">
            <IconButton
              onClick={nextPage}
              icon={<ChevronRightIcon h="3" w="3" />}
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => {
                gotoPage(pageCount - 1);
              }}
              icon={<ArrowRightIcon h="3" w="3" />}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
};

export default App;
