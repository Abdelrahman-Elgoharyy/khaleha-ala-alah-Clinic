import React, { useState, useEffect } from "react";
import styles from "./editPackageAdmin.module.css";
import doctorImage from "./doctor.png";
import AppointmentCard from "../Elements/AppointmentCard.jsx";
import { useLocation } from "react-router-dom";
import "../Elements/AppointmentCard.css";
import LoadingPage from "./LoadingPageForOverlay.jsx";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons"; // Importing a close icon from Ant Design
import axios from "axios";
import { message, Spin, Card, Table, Tooltip, Button, Form, Input } from "antd";
import {
  FilePdfOutlined,
  EditOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Buffer } from "buffer";
import UpdatePrescriptionForm from "../Elements/updatePrescriptionForm";

const backendUrl = "http://localhost:4000";

const PrescriptionsOverlay = ({ onCancel, prescription = [] }) => {
  const navigate = useNavigate();
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state for appointments
  const [isLoading, setIsLoading] = useState(true); // Add a loading state for CurrentPatient
  const [currentPatient, setCurrentPatient] = useState([]); // Add a currentPatient state
  const [patientFamilyMembers, setPatientFamilyMember] = useState([]); // Add a patientFamilyMember state
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isPrescriptionFilled, setIsPrescriptionFilled] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
  };

  const handleCheckout = async (doctor, date) => {
    navigate("/appointmentCheckout", {
      state: { Doctor: doctor, Date: date, selectedOption: selectedOption },
    });
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      medications: prescription.medications.map((medication) => ({
        medicine: medication.medicine,
        dosage: medication.dosage,
      })),
    });
  }, [prescription, form]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleAddHealthPackage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/admins",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Admin added successfully", response.data);
      onCancel();
      // You can add code to handle success, e.g., redirect to a new page.
    } catch (error) {
      console.error("Error adding admin", error);
      onCancel();
      // You can add code to handle errors, e.g., show an error message to the user.
    }
  };

  const openPDF = (prescription) => {
    if (prescription.fileData) {
      const pdfBlob = new Blob([Buffer.from(prescription.fileData, "base64")], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
    }
  };
  const downloadPDF = (prescription) => {
    if (prescription.fileData) {
      const pdfBlob = new Blob([Buffer.from(prescription.fileData, "base64")], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(pdfBlob);
      a.download = "prescription.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const isMedicineValid = (medicine) => {
    return medicine && medicine.trim() !== "";
  };
  return (
    <>
      <div
        className={styles.confirmationBackdrop}
        onClick={handleBackdropClick}
      >
        <div className={styles.confirmationDialog}>
          {loading ? ( // Render a loading message when loading is true
            <div className="testDiv">
              <LoadingPage />
            </div>
          ) : (
            <>
              <Card
                key={prescription._id}
                title={
                  <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        Date: {new Date(prescription.date).toLocaleDateString()}
                        {prescription.isFilled === true && (
                          <Tooltip title="Prescription Filled">
                            <CheckCircleOutlined
                              style={{ color: "green", marginLeft: "3px" }}
                            />
                          </Tooltip>
                        )}
                      </div>
                      {prescription.pdfFileID && (
                        <div>
                          <Tooltip title="Open PDF">
                            <FilePdfOutlined
                              style={{
                                cursor: "pointer",
                                color: "#1890ff",
                                marginRight: "10px",
                              }}
                              onClick={() => openPDF(prescription)}
                            />
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <DownloadOutlined
                              style={{
                                cursor: "pointer",
                                color: "#1890ff",
                                marginRight: "10px",
                              }}
                              onClick={() => downloadPDF(prescription)}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <Form form={form} layout="vertical">
                      <Form.List
                        name="medications"
                        rules={[
                          {
                            required: true,
                            message: "Please add at least one medicine.",
                          },
                        ]}
                      >
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, fieldKey, ...restField }) => (
                                <div
                                  key={key}
                                  style={{ display: "flex", marginBottom: 8 }}
                                >
                                  <Form.Item
                                    {...restField}
                                    name={[name, "medicine"]}
                                    fieldKey={[fieldKey, "medicine"]}
                                    label="Medicine"
                                    style={{ marginRight: 8, flex: 1 }}
                                  >
                                    <Input
                                      placeholder="Medicine"
                                      readOnly={"true"}
                                      style={{ cursor: "pointer" }}
                                      onChange={(e) => {
                                        if (!isPrescriptionFilled) {
                                          const newMedications = form
                                            .getFieldValue("medications")
                                            .map((medication, index) => {
                                              if (index === name) {
                                                return {
                                                  ...medication,
                                                  medicine: e.target.value,
                                                  dosage: "",
                                                };
                                              }
                                              return medication;
                                            });
                                          form.setFieldsValue({
                                            medications: newMedications,
                                          });
                                        }
                                      }}
                                      disabled={isPrescriptionFilled}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "dosage"]}
                                    fieldKey={[fieldKey, "dosage"]}
                                    label="Dosage"
                                    rules={[
                                      {
                                        required: isMedicineValid(
                                          form.getFieldValue([
                                            "medications",
                                            name,
                                            "medicine",
                                          ])
                                        ),
                                        message: "Please enter the dosage.",
                                      },
                                    ]}
                                    style={{ marginRight: 8, flex: 1 }}
                                  >
                                    <Input
                                      placeholder="Dosage"
                                      style={{ cursor: "pointer" }}
                                      readOnly={"true"}
                                      disabled={
                                        !form.getFieldValue([
                                          "medications",
                                          name,
                                          "medicine",
                                        ])
                                      }
                                      onChange={(e) => {
                                        const newMedications = form
                                          .getFieldValue("medications")
                                          .map((medication, index) => {
                                            if (index === name) {
                                              return {
                                                ...medication,
                                                dosage: e.target.value,
                                              };
                                            }
                                            return medication;
                                          });
                                        form.setFieldsValue({
                                          medications: newMedications,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </Form.List>
                    </Form>
                  </>
                }
                style={{ marginBottom: "20px" }}
              ></Card>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PrescriptionsOverlay;
