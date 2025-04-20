import React from 'react';
import { useQuery } from 'react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@material-ui/core';
import { Visibility, GetApp, Delete } from '@material-ui/icons';
import { format } from 'date-fns';
import { fetchDocuments } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: number;
  title: string;
  created_at: string;
  creator: {
    full_name: string;
  };
  category: {
    name: string;
  };
}

const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const { data: documents, isLoading, error } = useQuery('documents', fetchDocuments);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading documents</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc: Document) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{doc.category.name}</TableCell>
              <TableCell>{doc.creator.full_name}</TableCell>
              <TableCell>
                {format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <Tooltip title="View">
                  <IconButton
                    onClick={() => navigate(`/documents/${doc.id}`)}
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton>
                    <GetApp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentList;