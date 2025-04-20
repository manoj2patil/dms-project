-- Document Management System Database Structure

-- Users and Authentication
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(32)
);

-- User Groups
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Group Mapping
CREATE TABLE user_groups (
    user_id INTEGER REFERENCES users(user_id),
    group_id INTEGER REFERENCES groups(group_id),
    PRIMARY KEY (user_id, group_id)
);

-- Document Categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(category_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(512) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    md5_hash VARCHAR(32) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id),
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deletion_date TIMESTAMP,
    encryption_key_id VARCHAR(64),
    ocr_processed BOOLEAN DEFAULT false,
    language_detected VARCHAR(10),
    retention_date TIMESTAMP
);

-- Document Versions
CREATE TABLE document_versions (
    version_id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(document_id),
    version_number INTEGER NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size BIGINT NOT NULL,
    md5_hash VARCHAR(32) NOT NULL,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT
);

-- Document Metadata
CREATE TABLE document_metadata (
    metadata_id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(document_id),
    key VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags
CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Tags
CREATE TABLE document_tags (
    document_id INTEGER REFERENCES documents(document_id),
    tag_id INTEGER REFERENCES tags(tag_id),
    PRIMARY KEY (document_id, tag_id)
);

-- Permissions
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(document_id),
    user_id INTEGER REFERENCES users(user_id),
    group_id INTEGER REFERENCES groups(group_id),
    can_read BOOLEAN DEFAULT false,
    can_write BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_share BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_log (
    audit_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    document_id INTEGER REFERENCES documents(document_id),
    action VARCHAR(50) NOT NULL,
    action_details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflows
CREATE TABLE workflows (
    workflow_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Steps
CREATE TABLE workflow_steps (
    step_id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflows(workflow_id),
    step_order INTEGER NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    assignee_id INTEGER REFERENCES users(user_id),
    group_id INTEGER REFERENCES groups(group_id),
    action_required TEXT,
    deadline_days INTEGER
);

-- Document Workflows
CREATE TABLE document_workflows (
    document_id INTEGER REFERENCES documents(document_id),
    workflow_id INTEGER REFERENCES workflows(workflow_id),
    current_step INTEGER REFERENCES workflow_steps(step_id),
    status VARCHAR(50) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    PRIMARY KEY (document_id, workflow_id)
);

-- Create necessary indexes
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_document_metadata_doc_id ON document_metadata(document_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_document ON audit_log(document_id);
CREATE INDEX idx_permissions_document ON permissions(document_id);
CREATE INDEX idx_permissions_user ON permissions(user_id);
CREATE INDEX idx_permissions_group ON permissions(group_id);