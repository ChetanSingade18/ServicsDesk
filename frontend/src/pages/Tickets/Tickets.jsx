import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketsComponent = ({ role, userId, token }) => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [showAddTicketForm, setShowAddTicketForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [reason, setReason] = useState('');
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);

  const STATUS_OPTIONS = {
    APPROVED: 'approved',
    PENDING: 'pending',
    RESOLVED: 'resolved',
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:4000/tickets' + (role === "user" ? "/user" : ""), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data.tickets);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchTickets();
    }
  }, [userId, token, showAddTicketForm, role]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddTicket = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { filePath } = await uploadResponse.json();

      const response = await fetch('http://localhost:4000/tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
        body: JSON.stringify({ title, imageUrl: filePath, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      setShowAddTicketForm(false);
      setTitle('');
      setDescription('');
      setFile(null);
      toast.success('Ticket created successfully');
      fetchTickets();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = (ticketId) => {
    setSelectedTicketId(ticketId);
    setStatus(''); // Reset status
    setReason(''); // Reset reason
    setShowStatusChangeDialog(true); // Show dialog
  };

  const confirmStatusChange = async () => {
    if (status === STATUS_OPTIONS.RESOLVED && !reason) {
      alert('Please provide a reason for resolving the ticket.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/tickets/status/${selectedTicketId}/${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket status');
      }

      toast.success('Ticket status updated successfully');
      setShowStatusChangeDialog(false); // Close dialog
      setSelectedTicketId(null); // Reset selected ticket ID
      setStatus(''); // Reset status
      setReason(''); // Reset reason
      fetchTickets(); // Refresh the ticket list
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Tickets List
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setShowAddTicketForm(true)}>
          Add Ticket
        </Button>
      </Toolbar>
      {error && <Typography color="error" align="center">{error}</Typography>}

      {/* Dialog for adding a ticket */}
      <Dialog open={showAddTicketForm} onClose={() => setShowAddTicketForm(false)}>
        <DialogTitle>Add Ticket</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddTicketForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddTicket} color="primary">
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for changing ticket status */}
      <Dialog open={showStatusChangeDialog} onClose={() => setShowStatusChangeDialog(false)}>
        <DialogTitle>Change Ticket Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
          {status === STATUS_OPTIONS.RESOLVED && (
            <TextField
              label="Reason"
              variant="outlined"
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusChangeDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmStatusChange} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reason</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Creation Date</TableCell>
            {role === "admin" && <TableCell>Actions</TableCell>} {/* Show Actions column for admin */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell>{ticket.reason || "N/A"}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              {role === "admin" && (
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleStatusChange(ticket._id)}>
                    Change Status
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ToastContainer />
    </TableContainer>
  );
};

export default TicketsComponent;