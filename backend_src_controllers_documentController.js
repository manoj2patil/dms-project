const { Document, User, Category, Tag } = require('../models');
const { Op } = require('sequelize');
const { createAuditLog } = require('../services/auditService');
const { processOCR } = require('../services/ocrService');
const { validatePermission } = require('../services/permissionService');
const AppError = require('../utils/appError');

class DocumentController {
  async create(req, res, next) {
    try {
      const { title, description, category_id, tags } = req.body;
      const file = req.file;

      if (!file) {
        throw new AppError('No file uploaded', 400);
      }

      // Create document
      const document = await Document.create({
        title,
        description,
        file_path: file.path,
        file_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        category_id,
        created_by: req.user.id
      });

      // Process OCR if applicable
      if (this.isOCRRequired(file.mimetype)) {
        processOCR(document.id, file.path);
      }

      // Add tags if provided
      if (tags && tags.length > 0) {
        await document.setTags(tags);
      }

      // Create audit log
      await createAuditLog({
        user_id: req.user.id,
        document_id: document.id,
        action: 'CREATE',
        details: 'Document created'
      });

      res.status(201).json({
        status: 'success',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params;

      const document = await Document.findByPk(id, {
        include: [
          { model: User, as: 'creator' },
          { model: Category },
          { model: Tag }
        ]
      });

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      // Check permissions
      await validatePermission(req.user.id, document.id, 'read');

      res.json({
        status: 'success',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, category_id, tags } = req.body;

      const document = await Document.findByPk(id);

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      // Check permissions
      await validatePermission(req.user.id, document.id, 'write');

      // Update document
      await document.update({
        title,
        description,
        category_id
      });

      // Update tags if provided
      if (tags) {
        await document.setTags(tags);
      }

      // Create audit log
      await createAuditLog({
        user_id: req.user.id,
        document_id: document.id,
        action: 'UPDATE',
        details: 'Document updated'
      });

      res.json({
        status: 'success',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const document = await Document.findByPk(id);

      if (!document) {
        throw new AppError('Document not found', 404);
      }

      // Check permissions
      await validatePermission(req.user.id, document.id, 'delete');

      // Soft delete
      await document.update({ is_deleted: true, deletion_date: new Date() });

      // Create audit log
      await createAuditLog({
        user_id: req.user.id,
        document_id: document.id,
        action: 'DELETE',
        details: 'Document deleted'
      });

      res.json({
        status: 'success',
        message: 'Document deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { query, category, tags, dateFrom, dateTo } = req.query;
      
      const whereClause = {
        is_deleted: false
      };

      if (query) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ];
      }

      if (category) {
        whereClause.category_id = category;
      }

      if (dateFrom || dateTo) {
        whereClause.created_at = {};
        if (dateFrom) whereClause.created_at[Op.gte] = dateFrom;
        if (dateTo) whereClause.created_at[Op.lte] = dateTo;
      }

      const documents = await Document.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'creator' },
          { model: Category },
          { model: Tag, where: tags ? { id: tags } : undefined }
        ]
      });

      res.json({
        status: 'success',
        data: documents
      });
    } catch (error) {
      next(error);
    }
  }

  isOCRRequired(mimeType) {
    const ocrMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
    return ocrMimeTypes.includes(mimeType);
  }
}

module.exports = new DocumentController();
