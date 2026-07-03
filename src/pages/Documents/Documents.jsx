import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  LoaderCircle,
  FileImage,
  FileWarning,
  FileBadge2,
} from "lucide-react";
import PageShell from "../../components/PageShell/PageShell";
import "./Documents.css";

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_FORMATS = [".pdf", ".docx", ".xlsx", ".pptx", ".png", ".jpg", ".jpeg"];

const IMAGE_FORMATS = [".png", ".jpg", ".jpeg"];
const DOCUMENT_FORMATS = [".docx", ".xlsx", ".pptx"];

const getFileExtension = (fileName) => `.${fileName.split(".").pop()?.toLowerCase()}`;

const getPreviewType = (file) => {
  const extension = getFileExtension(file.name);

  if (IMAGE_FORMATS.includes(extension)) {
    return "image";
  }

  if (extension === ".pdf") {
    return "pdf";
  }

  if (DOCUMENT_FORMATS.includes(extension)) {
    return "document";
  }

  return "unknown";
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function Documents() {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Drag and drop files here or browse from your device."
  );

  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(previewFile.file);
    setPreviewUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [previewFile]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 2400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastMessage]);

  const addFiles = (fileList) => {
    if (isUploading) {
      return;
    }

    const incomingFiles = Array.from(fileList ?? []);

    if (incomingFiles.length === 0) {
      return;
    }

    const validFiles = [];
    const rejectedFiles = [];

    incomingFiles.forEach((file) => {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const isSupported = ACCEPTED_FORMATS.includes(fileExtension);
      const isWithinSizeLimit = file.size <= MAX_FILE_SIZE_BYTES;

      if (isSupported && isWithinSizeLimit) {
        validFiles.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
        });
        return;
      }

      rejectedFiles.push(file.name);
    });

    if (validFiles.length > 0) {
      setSelectedFiles((currentFiles) => {
        const mergedFiles = [...currentFiles];

        validFiles.forEach((newFile) => {
          const alreadyExists = mergedFiles.some(
            (existingFile) => existingFile.id === newFile.id
          );

          if (!alreadyExists) {
            mergedFiles.push(newFile);
          }
        });

        return mergedFiles;
      });

      setStatusMessage(`${validFiles.length} file(s) ready for upload preview.`);
    }

    if (rejectedFiles.length > 0) {
      setStatusMessage(
        `${rejectedFiles.join(", ")} could not be added. Use PDF, DOCX, XLSX, PPTX, PNG, or JPG files up to ${MAX_FILE_SIZE_MB} MB.`
      );
    }
  };

  const handleBrowseClick = () => {
    if (isUploading) {
      return;
    }

    if (window.showOpenFilePicker) {
      window
        .showOpenFilePicker({
          multiple: true,
          startIn: "desktop",
          excludeAcceptAllOption: false,
          types: [
            {
              description: "Supported documents and images",
              accept: {
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                  ".docx",
                ],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                  ".xlsx",
                ],
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
                  ".pptx",
                ],
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
              },
            },
          ],
        })
        .then((handles) => Promise.all(handles.map((handle) => handle.getFile())))
        .then((files) => addFiles(files))
        .catch((error) => {
          if (error?.name !== "AbortError") {
            inputRef.current?.click();
          }
        });

      return;
    }

    inputRef.current?.click();
  };

  const handleInputChange = (event) => {
    if (isUploading) {
      event.target.value = "";
      return;
    }

    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    addFiles(event.dataTransfer.files);
  };

  const handleRemoveFile = (id) => {
    if (isUploading) {
      return;
    }

    setSelectedFiles((currentFiles) =>
      currentFiles.filter((currentFile) => currentFile.id !== id)
    );
  };

  const handleClearAll = () => {
    if (isUploading) {
      return;
    }

    setSelectedFiles([]);
    setStatusMessage("Files cleared. Add more documents to continue.");
  };

  const handleUpload = () => {
    if (isUploading || selectedFiles.length === 0) {
      return;
    }

    const filesToUpload = [...selectedFiles];
    setIsUploading(true);
    setUploadProgress(0);
    setStatusMessage("Uploading files...");

    let progress = 0;

    const uploadTimer = window.setInterval(() => {
      progress = Math.min(progress + 10, 100);
      setUploadProgress(progress);

      if (progress === 100) {
        window.clearInterval(uploadTimer);

        window.setTimeout(() => {
          setUploadedFiles((currentFiles) => [...filesToUpload, ...currentFiles]);
          setSelectedFiles([]);
          setIsUploading(false);
          setStatusMessage("Upload Successful");
        }, 250);
      }
    }, 180);
  };

  const handleOpenPreview = (fileEntry) => {
    if (isUploading) {
      return;
    }

    setPreviewFile(fileEntry);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
    setPreviewUrl("");
  };

  const handleOpenDeleteModal = (fileEntry) => {
    if (isUploading) {
      return;
    }

    setDeleteTarget(fileEntry);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setUploadedFiles((currentFiles) =>
      currentFiles.filter((currentFile) => currentFile.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
    setToastMessage("Document deleted successfully.");
  };

  const previewType = previewFile ? getPreviewType(previewFile.file) : null;
  const deletePreviewType = deleteTarget ? getPreviewType(deleteTarget.file) : null;

  return (
    <PageShell
      title="Documents"
      subtitle="Upload and stage project files directly in the browser."
    >
      <div className="documents-page">
        

        <section className="documents-upload page-shell-card">
          <div
            className={`documents-dropzone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="documents-dropzone-icon" aria-hidden="true">
              <UploadCloud size={30} />
            </div>

            <div className="documents-dropzone-copy">
              <h3>Drag and drop your files here</h3>
              <p>
                Drop one or more files, or browse from your device to stage them
                locally.
              </p>

              <div className="documents-actions">
                <button
                  type="button"
                  className="documents-browse-button"
                  disabled={isUploading}
                  onClick={handleBrowseClick}
                >
                  Browse files
                </button>

                {selectedFiles.length > 0 && (
                  <button
                    type="button"
                    className="documents-clear-button"
                    disabled={isUploading}
                    onClick={handleClearAll}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <input
              ref={inputRef}
              className="documents-hidden-input"
              type="file"
              multiple
              accept={ACCEPTED_FORMATS.join(",")}
              onChange={handleInputChange}
            />
          </div>

          <p className="documents-status" role="status" aria-live="polite">
            {statusMessage}
          </p>

          {isUploading && (
            <div className="documents-progress-wrap" aria-label="Upload progress">
              <div className="documents-progress-row">
                <span>Uploading</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="documents-progress-track" aria-hidden="true">
                <div
                  className="documents-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="documents-spinner-row">
                <LoaderCircle size={18} className="documents-spinner" />
                <span>Processing selected files</span>
              </div>
            </div>
          )}

          <div className="documents-support-grid">
            {ACCEPTED_FORMATS.map((format) => (
              <div key={format} className="documents-format-pill">
                <CheckCircle2 size={16} />
                <span>{format.toUpperCase().replace(".", "")}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="documents-list page-shell-card">
          <div className="documents-list-header">
            <div>
              <h3>Selected files</h3>
              <p>
                Review the files queued in the browser before connecting this page
                to storage or submission workflows.
              </p>
            </div>
            <span className="documents-count">{selectedFiles.length} item(s)</span>
          </div>

          {selectedFiles.length > 0 ? (
            <div className="documents-file-list">
              {selectedFiles.map(({ id, file }) => (
                <article key={id} className="documents-file-item">
                  <div className="documents-file-icon" aria-hidden="true">
                    <FileText size={20} />
                  </div>

                  <div className="documents-file-details">
                    <h4>{file.name}</h4>
                    <p>
                      {formatFileSize(file.size)} · {file.type || "Unknown type"}
                    </p>
                  </div>

                  <div className="documents-row-actions">
                    <button
                      type="button"
                      className="documents-view-button"
                      disabled={isUploading}
                      onClick={() => handleOpenPreview({ id, file })}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="documents-remove-button"
                      disabled={isUploading}
                      onClick={() => handleRemoveFile(id)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="documents-empty-state">
              <p>No files selected yet.</p>
            </div>
          )}

          <div className="documents-upload-actions">
            <button
              type="button"
              className="documents-upload-button"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </section>

        <section className="documents-list page-shell-card">
          <div className="documents-list-header">
            <div>
              <h3>Uploaded Documents</h3>
              <p>Files that completed the simulated upload appear here.</p>
            </div>
            <span className="documents-count">{uploadedFiles.length} item(s)</span>
          </div>

          {uploadedFiles.length > 0 ? (
            <div className="documents-file-list">
              {uploadedFiles.map(({ id, file }) => (
                <article key={id} className="documents-file-item documents-file-item--uploaded">
                  <div className="documents-file-icon" aria-hidden="true">
                    <CheckCircle2 size={20} />
                  </div>

                  <div className="documents-file-details">
                    <h4>{file.name}</h4>
                    <p>
                      {formatFileSize(file.size)} · {file.type || "Unknown type"}
                    </p>
                  </div>

                  <div className="documents-row-actions">
                    <button
                      type="button"
                      className="documents-view-button"
                      disabled={isUploading}
                      onClick={() => handleOpenPreview({ id, file })}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="documents-delete-button"
                      disabled={isUploading}
                      onClick={() => handleOpenDeleteModal({ id, file })}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="documents-empty-state">
              <p>No uploaded documents yet.</p>
            </div>
          )}
        </section>

        {previewFile && (
          <div
            className="documents-modal-overlay"
            role="presentation"
            onMouseDown={handleClosePreview}
          >
            <div
              className="documents-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="documents-preview-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="documents-modal-header">
                <div>
                  <p className="documents-modal-eyebrow">Preview file</p>
                  <h3 id="documents-preview-title">{previewFile.file.name}</h3>
                </div>

                <button
                  type="button"
                  className="documents-modal-close"
                  onClick={handleClosePreview}
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="documents-modal-body">
                {previewType === "image" && previewUrl ? (
                  <div className="documents-modal-image-wrap">
                    <img
                      className="documents-modal-image"
                      src={previewUrl}
                      alt={previewFile.file.name}
                    />
                  </div>
                ) : previewType === "pdf" ? (
                  <div className="documents-modal-placeholder">
                    <div className="documents-modal-file-icon documents-modal-file-icon--pdf">
                      <FileWarning size={28} />
                    </div>
                    <h4>{previewFile.file.name}</h4>
                    <p>PDF preview is not available in frontend demo.</p>
                  </div>
                ) : previewType === "document" ? (
                  <div className="documents-modal-placeholder">
                    <div className="documents-modal-file-icon">
                      <FileBadge2 size={28} />
                    </div>
                    <h4>{previewFile.file.name}</h4>
                    <div className="documents-modal-info-grid">
                      <div>
                        <span>File size</span>
                        <strong>{formatFileSize(previewFile.file.size)}</strong>
                      </div>
                      <div>
                        <span>File type</span>
                        <strong>{previewFile.file.type || "Unknown type"}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="documents-modal-placeholder">
                    <div className="documents-modal-file-icon">
                      <FileImage size={28} />
                    </div>
                    <h4>{previewFile.file.name}</h4>
                    <p>This file type cannot be previewed in the frontend demo.</p>
                  </div>
                )}
              </div>

              <div className="documents-modal-footer">
                <div className="documents-modal-info-grid documents-modal-info-grid--full">
                  <div>
                    <span>File name</span>
                    <strong>{previewFile.file.name}</strong>
                  </div>
                  <div>
                    <span>File size</span>
                    <strong>{formatFileSize(previewFile.file.size)}</strong>
                  </div>
                  <div>
                    <span>File type</span>
                    <strong>{previewFile.file.type || "Unknown type"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div
            className="documents-modal-overlay"
            role="presentation"
            onMouseDown={handleCloseDeleteModal}
          >
            <div
              className="documents-modal documents-modal--confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="documents-delete-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="documents-modal-header">
                <div>
                  <p className="documents-modal-eyebrow">Confirmation</p>
                  <h3 id="documents-delete-title">Delete Document</h3>
                </div>

                <button
                  type="button"
                  className="documents-modal-close"
                  onClick={handleCloseDeleteModal}
                  aria-label="Close delete confirmation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="documents-modal-body">
                <div className="documents-modal-placeholder documents-modal-placeholder--confirm">
                  <div className="documents-modal-file-icon documents-modal-file-icon--delete">
                    <FileText size={28} />
                  </div>
                  <h4>Are you sure you want to delete this document?</h4>
                  <div className="documents-modal-info-grid documents-modal-info-grid--full">
                    <div>
                      <span>File name</span>
                      <strong>{deleteTarget.file.name}</strong>
                    </div>
                    <div>
                      <span>File size</span>
                      <strong>{formatFileSize(deleteTarget.file.size)}</strong>
                    </div>
                    <div>
                      <span>File type</span>
                      <strong>{deleteTarget.file.type || "Unknown type"}</strong>
                    </div>
                    <div>
                      <span>Preview type</span>
                      <strong>
                        {deletePreviewType === "image"
                          ? "Image"
                          : deletePreviewType === "pdf"
                          ? "PDF"
                          : "Document"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="documents-modal-footer documents-modal-footer--actions">
                <button
                  type="button"
                  className="documents-clear-button"
                  onClick={handleCloseDeleteModal}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="documents-delete-confirm-button"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && <div className="documents-toast">{toastMessage}</div>}
      </div>
    </PageShell>
  );
}

export default Documents;
