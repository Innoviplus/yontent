
import { useAdminPanelState } from './useAdminPanelState';
import AdminPanelContent from './AdminPanelContent';

// Entry-level wrapper for the Admin Panel page
const AdminPanel = () => {
  const state = useAdminPanelState();
  return <AdminPanelContent state={state} />;
};

export default AdminPanel;
