import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import {
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@material-ui/core';
import { uploadDocument } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string()
});

const DocumentUpload: React.FC = () => {
  const mutation = useMutation(uploadDocument);

  const formik = useFormik({
    initialValues: {
      title: '',
      category: '',
      description: '',
      file: null as File | null
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!values.file) return;

      const formData = new FormData();
      formData.append('file', values.file);
      formData.append('title', values.title);
      formData.append('category', values.category);
      formData.append('description', values.description);

      await mutation.mutateAsync(formData);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    formik.setFieldValue('file', acceptedFiles[0]);
  }, [formik]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <Paper style={{ padding: 20 }}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Document Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
          >
            <MenuItem value="contracts">Contracts</MenuItem>
            <MenuItem value="invoices">Invoices</MenuItem>
            <MenuItem value="reports">Reports</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          multiline
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          margin="normal"
        />

        <Box
          {...getRootProps()}
          style={{
            border: '2px dashed #cccccc',
            borderRadius: 4,
            padding: 20,
            textAlign: 'center',
            marginTop: 20
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the files here...</Typography>
          ) : (
            <Typography>
              Drag 'n' drop some files here, or click to select files
            </Typography>
          )}
          {formik.values.file && (
            <Typography variant="body2" style={{ marginTop: 10 }}>
              Selected file: {formik.values.file.name}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
          disabled={mutation.isLoading || !formik.values.file}
        >
          {mutation.isLoading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </form>
    </Paper>
  );
};

export default DocumentUpload;