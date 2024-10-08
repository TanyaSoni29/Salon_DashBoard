/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// Material Dashboard 2 React components
import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { getAllUserProfiles } from "service/operations/userProfileApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserIndex } from "slices/profileSlice";
import { setUsers } from "slices/profileSlice";
import { formatDate } from "utils/formateDate";
import { getAllServiceUsageByUser } from "service/operations/serviceAndServiceTransaction";
import { getAllServiceUsage } from "service/operations/serviceAndServiceTransaction";
import { getAllServiceTransactions } from "service/operations/serviceAndServiceTransaction";
import { getAllUser } from "service/operations/userApi";
import { refreshLocation } from "slices/locationSlice";

export default function data(
  filteredCustomers,
  handleEdit,
  setIsDeleteOpen,
  setViewModal,
  createModalOpen,
  isDeleteOpen,
  isEditOpen
) {
  const [rowsData, setRowsData] = useState([]);
  const { token } = useSelector((state) => state.auth);
  // const { services } = useSelector((state) => state.service);
  // console.log(services);
  const dispatch = useDispatch();
  const [serviceData, setServiceData] = useState({});
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await getAllUserProfiles(token);
  //       console.log("getAlluserProfile response", response.data);
  //       // dispatch(setUsers(response.data.filter((data) => data.role === "customer" && data.active)));
  //       // setRowsData(response.data.filter((data) => data.role === "customer" && data.active));
  //       const filteredUsers = response.data.filter(
  //         (data) => data.role === "customer" && data.active
  //       );
  //       const sortedUsers = filteredUsers.sort(
  //         (a, b) => new Date(b.created_at) - new Date(a.created_at)
  //       );

  //       dispatch(setUsers(sortedUsers));
  //       setRowsData(sortedUsers);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [createModalOpen, isDeleteOpen, isEditOpen]);
  useEffect(() => {
    dispatch(refreshLocation(token));
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfilesResponse = await getAllUser(token);
        const filteredUsers = userProfilesResponse.filter((data) => data.user.role === "customer");
        const sortedUsers = filteredUsers.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        dispatch(setUsers(sortedUsers));

        // const serviceUsageResponse = await getAllServiceUsage(token);
        // const serviceDataMap = {};

        // Map service usage data to user IDs
        // serviceUsageResponse.data.forEach((usage) => {
        //   serviceDataMap[usage.user] = {
        //     available_balance: usage.available_balance || 0,
        //     totalSpend: 0,
        //   };
        // });

        // const transactions = await getAllServiceTransactions(token);

        // transactions.data.forEach((transaction) => {
        //   if (transaction.type === "used" && serviceDataMap[transaction.user]) {
        //     const quantity = transaction.quantity || 0;
        //     serviceDataMap[transaction.user].totalSpend += quantity;
        //   }
        // });

        // Combine user profiles with their corresponding service usage data
        // const combinedData = sortedUsers.map((user) => ({
        //   ...user,
        //   available_balance: user.profile?.available_balance || 0, // Default to 0 if no usage found
        //   totalSpend: user..totalSpend || 0, // Default to 0 if no usage found
        // }));

        setRowsData(sortedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [createModalOpen, isDeleteOpen, isEditOpen]);

  const Author = ({ image, firstName, lastName, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {firstName} {lastName}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  // const Location = ({ name }) => (
  //   <MDBox lineHeight={1} textAlign="left">
  //     <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
  //       {name}
  //     </MDTypography>
  //   </MDBox>
  // );
  // console.log("rowsData----", rowsData);

  const Location = ({ locationId }) => {
    const { locations } = useSelector((state) => state.location); // Get locations from Redux

    // Find the location by ID
    const location = locations.find((loc) => loc.id === locationId);

    return (
      <MDBox lineHeight={1} textAlign="left">
        <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
          {location ? location.name : "-"} {/* Fallback if location is not found */}
        </MDTypography>
      </MDBox>
    );
  };

  const rows = (filteredCustomers.length > 0 ? filteredCustomers : rowsData).map((customer, i) => {
    // const serviceUsage = serviceData[customer._id] || {};

    return {
      userName: (
        <Author
          image={customer.profile?.avatar}
          firstName={customer.profile?.firstName}
          lastName={customer.profile?.lastName}
          email={customer.user?.email}
        />
      ),
      Admin: <Job title={customer.user?.role} />,
      location: <Location locationId={customer.profile?.preferred_location} />,
      phone_number: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {customer.profile?.phone_number}
        </MDTypography>
      ),
      minutesAvailable: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {customer.profile?.available_balance}
        </MDTypography>
      ),
      totalSpend: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {customer.profile?.total_spend}
        </MDTypography>
      ),
      lastUpdatedAt: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {formatDate(customer.profile?.updated_at)}
        </MDTypography>
      ),
      action: (
        <MDBox
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="8px"
        >
          <RemoveRedEyeIcon
            onClick={() => {
              const index =
                filteredCustomers.length > 0
                  ? rowsData.findIndex((u) => u.user.id === customer.user.id)
                  : i;
              dispatch(setUserIndex(index));
              setViewModal(true);
            }}
            sx={{ cursor: "pointer" }}
          />
          <EditIcon
            onClick={() => {
              const index =
                filteredCustomers.length > 0
                  ? rowsData.findIndex((u) => u.user.id === customer.user.id)
                  : i;
              dispatch(setUserIndex(index));
              handleEdit();
            }}
            sx={{ cursor: "pointer" }}
          />
          <DeleteIcon
            onClick={() => {
              const index =
                filteredCustomers.length > 0
                  ? rowsData.findIndex((u) => u.user.id === customer.user.id)
                  : i;
              dispatch(setUserIndex(index));
              setIsDeleteOpen(true);
            }}
            sx={{ cursor: "pointer" }}
          />
        </MDBox>
      ),
    };
  });

  return {
    columns: [
      { Header: "User Name", accessor: "userName", align: "left" },
      { Header: "Location", accessor: "location", align: "center" },
      { Header: "phone number", accessor: "phone_number", align: "center" },
      { Header: "Minutes Available", accessor: "minutesAvailable", align: "center" },
      { Header: "Total Spend Minutes", accessor: "totalSpend", align: "center" },
      { Header: "Last service purchase", accessor: "lastUpdatedAt", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows,
  };
}
