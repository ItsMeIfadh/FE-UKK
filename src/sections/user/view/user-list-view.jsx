import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
// import { _userList, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { useFetchAllUser } from 'src/hooks/user/useFetchAllUser';
import { LoadingScreen } from 'src/components/loading-screen';
// import { useMutationCreateUser } from 'src/hooks/user/useMutationCreateUser';
import { useMutationDeleteUser } from 'src/hooks/user/useMutationDeleteUser';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';


// ----------------------------------------------------------------------
const USER_STATUS_OPTIONS = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' }
]

const _roles = ['admin', 'pengguna', 'kelas']
const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'username', label: 'Nama Pengguna' },
  { id: 'no_telp', label: 'No Telepon', width: 180 },
  { id: 'address', label: 'Alamat Rumah', width: 220 },
  { id: 'role', label: 'Role', width: 180 },
  { id: 'is_active', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters = {
  username: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const router = useRouter();

  const confirm = useBoolean();

  // console.log('tableData', tableData);

  const { data: userList = [], isLoading, isFetching } = useFetchAllUser();
  const [tableData, setTableData] = useState(userList || []);
  const [filters, setFilters] = useState(defaultFilters);
  useEffect(() => {
    setTableData(userList || []);
  }, [userList]);



  const { mutateAsync: deleteUser } = useMutationDeleteUser({
    onSuccess: (data) => {
      console.log('User berhasil dihapus', data);
      enqueueSnackbar('User berhasil dihapus!');
      router.push(paths.dashboard.user.list);
      queryClient.invalidateQueries(['fetch.all.users']);
    },
    onError: (error) => {
      console.error('Gagal menambah User', error);
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  })


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteUser(id); // Panggil API untuk hapus user di server
        setTableData((prevData) => {
          const newData = prevData.filter((row) => row.id !== id);
          table.onUpdatePageDeleteRow(newData.length); // pakai newData.length
          return newData;
        });
        // enqueueSnackbar('User berhasil dihapus!', { variant: 'success' });
      } catch (error) {
        console.error('Gagal menghapus user:', error);
        enqueueSnackbar('Gagal menghapus user', { variant: 'error' });
      }
    },
    [deleteUser, table, enqueueSnackbar]
  );
  

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  if (isLoading || isFetching) {
    return (
      <LoadingScreen />
    );
  }


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List user"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              User Baru
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'online' && 'success') ||
                      (tab.value === 'offline' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && userList?.length}  {/* Count all users */}
                    {tab.value === 'online' &&
                      userList?.filter((user) => user.is_active).length}  {/* Count online users */}
                    {tab.value === 'offline' &&
                      userList?.filter((user) => !user.is_active).length}  {/* Count offline users */}
                  </Label>
                }
              />
            ))}
          </Tabs>


          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_roles}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
      <ConfirmDialog
  open={confirm.value}
  onClose={confirm.onFalse}
  title="Hapus"
  content={
    <>
      Apakah Anda yakin ingin menghapus <strong>{table.selected.length}</strong> item?
    </>
  }
  action={
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        handleDeleteRows();
        confirm.onFalse();
      }}
    >
      Hapus
    </Button>
  }
/>

    </>
  );
}

// ----------------------------------------------------------------------
function applyFilter({ inputData = [], comparator, filters }) {
  if (!Array.isArray(inputData)) return [];

  const { username: name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredUsers = stabilizedThis.map((el) => el[0]);

  // Filter berdasarkan nama pengguna
  if (name) {
    filteredUsers = filteredUsers.filter(
      (user) => user.username?.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter berdasarkan status
  if (status !== 'all') {
    if (status === 'online') {
      filteredUsers = filteredUsers.filter((user) => user.is_active); // hanya yang online
    } else if (status === 'offline') {
      filteredUsers = filteredUsers.filter((user) => !user.is_active); // hanya yang offline
    }
  }

  // Filter berdasarkan role
  if (role?.length) {
    filteredUsers = filteredUsers.filter((user) => role.includes(user.role));
  }

  return filteredUsers;
}
