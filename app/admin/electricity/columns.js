export const COLUMNS = [
  {
    flex: 1,
    field: "room",
    headerName: "방 호수",
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { room } = row;
      return <span>{room}</span>;
    },
  },
  {
    flex: 1,
    field: "kwh",
    headerName: "사용량 (kWh)",
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { kwh } = row;
      return <span>{kwh}</span>;
    },
  },
  {
    flex: 1,
    field: "price",
    headerName: "요금 (원)",
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { price } = row;
      return <span>{price}</span>;
    },
  },
];
