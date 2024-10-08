import React, { useRef, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import customerTableData from "layouts/tables/data/customerTableData";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "slices/profileSlice";
import { refreshUser } from "slices/profileSlice";
import Modal from "../../components/Modal";
import CreateCustomerModal from "../../components/CustomerActionButton/CreateCustomerModal";
import ViewCustomerModal from "../../components/CustomerActionButton/ViewCustomerModal";
import DeleteCustomerModal from "../../components/CustomerActionButton/DeleteCustomerModal";
import EditCustomerModal from "../../components/CustomerActionButton/EditCustomerModal";
import { deleteCustomerProfile } from "service/operations/userApi";
import MDInput from "components/MDInput";
import { deleteUserProfile } from "service/operations/userProfileApi";

function index() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const { users, userIndex } = useSelector((state) => state.profile);
  const activeUser = users[userIndex];
  // console.log("active user to delete", activeUser);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const handleEditClose = () => setIsEditOpen(false);
  const handleDeleteClose = () => setIsDeleteOpen(false);
  const handleCreateModalClose = () => setCreateModalOpen(false);
  const handleViewModalClose = () => setViewModal(false);
  console.log("users----", users);
  const filteredCustomers = users.filter(
    (user) =>
      (user.profile?.firstName &&
        user.profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.profile?.phone_number &&
        user.profile?.phone_number.toLowerCase().includes(searchQuery.toLowerCase()))
    // (user.preferred_location.name &&
    //   user.preferred_location.name.toLowerCase().includes(searchQuery.toLowerCase()))
    // Assuming 'name' is the field to search
  );
  const handleSearch = async () => {
    console.log(searchQuery);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
      searchRef.current.blur();
    }
  };
  const handleCreateNewCustomer = () => {
    setCreateModalOpen(true);
  };
  const handleEdit = () => {
    setIsEditOpen(true);
  };
  const handleDelete = async () => {
    try {
      const result = await deleteUserProfile(token, activeUser.user.id);
      if (result) {
        dispatch(removeUser(activeUser._id));
        dispatch(refreshUser());
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error("Error during customer deletion:", error);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const { columns, rows } = customerTableData(
    filteredCustomers,
    handleEdit,
    setIsDeleteOpen,
    setViewModal,
    createModalOpen,
    isDeleteOpen,
    isEditOpen
  );

  return (
    <>
      <Modal open={createModalOpen} setOpen={setCreateModalOpen}>
        <CreateCustomerModal onClose={handleCreateModalClose} />
      </Modal>
      <Modal open={viewModal} setOpen={setViewModal}>
        <ViewCustomerModal onClose={handleViewModalClose} />
      </Modal>
      <Modal open={isEditOpen} setOpen={setIsEditOpen}>
        <EditCustomerModal onClose={handleEditClose} />
      </Modal>
      <Modal open={isDeleteOpen} setOpen={setIsDeleteOpen}>
        <DeleteCustomerModal onClose={handleDeleteClose} handleDelete={handleDelete} />
      </Modal>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={4} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12} display="flex" justifyContent="space-between">
              <MDBox pr={1} sx={{ flex: 1 }}>
                <MDInput
                  label="Search Customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  inputProps={{
                    ref: searchRef,
                    onFocus: (event) => event.target.select(),
                  }}
                  // sx={{ width: "20%" }}
                />
              </MDBox>
              <Button
                sx={{
                  backgroundColor: "#328BED",
                  color: "#fff",
                  marginBottom: "8px",
                  "&:hover": {
                    backgroundColor: "#63A0F5",
                    color: "#fff",
                  },
                  "&:focus": {
                    color: "#fff",
                  },
                  "&:active": {
                    color: "#fff",
                  },
                  "&:disabled": {
                    backgroundColor: "#D3D3D3",
                    color: "#fff",
                  },
                }}
                onClick={handleCreateNewCustomer}
              >
                Add New Customer
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Customers
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={true}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt="auto">
          <Footer />
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default index;
