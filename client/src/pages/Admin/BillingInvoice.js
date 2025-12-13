import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Textarea,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { fetchBillingInvoice } from "../../actions/billingInvoiceActions";
import { DeleteIcon } from "@chakra-ui/icons";
import Logo from "../../assets/kids logo.png";
import { createBillingInvoice } from "../../actions/billingInvoiceActions";
import InvoicePDF from "./InvoicePDF";

const BillingInvoice = () => {
  const dispatch = useDispatch();
  const [showPDF, setShowPDF] = useState(false);
  const toast = useToast();
  const billingInvoiceCreate = useSelector(
    (state) => state.billingInvoiceCreate
  );
  const billingInvoiceDetails = useSelector(
    (state) => state.billingInvoiceDetails
  );
  const { invoice } = billingInvoiceDetails;

  const handleLoadInvoice = () => {
    dispatch(fetchBillingInvoice(form.invoiceNumber));
  };
  useEffect(() => {
    if (invoice && invoice.invoiceNumber) {
      setForm({
        ...invoice,
        logo: invoice.logo || Logo, // fallback if logo not stored
      });
    }
  }, [invoice]);
  const { loading, success, error } = billingInvoiceCreate;

  const [form, setForm] = useState({
    logo: Logo,
    from: {
      name: "",
      businessName: "",
      email: "",
      address: "",
      phone: "",
      businessNumber: "",
    },
    to: {
      name: "",
      email: "",
      address: "",
      phone: "",
      mobile: "",
      fax: "",
    },
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    items: [{ description: "", rate: 0, qty: 1, cgst: 0, sgst: 0, amount: 0 }],
    notes: "",
  });

  // Calculate totals whenever form.items changes
  const calculateItemAmount = (item) => {
    return item.rate * item.qty;
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + calculateItemAmount(item),
      0
    );
    const totalCgst = items.reduce(
      (sum, item) => sum + (item.cgst / 100) * calculateItemAmount(item),
      0
    );
    const totalSgst = items.reduce(
      (sum, item) => sum + (item.sgst / 100) * calculateItemAmount(item),
      0
    );
    const total = subtotal + totalCgst + totalSgst;
    return { subtotal, totalCgst, totalSgst, total };
  };

  const { subtotal, totalCgst, totalSgst, total } = calculateTotals(form.items);

  useEffect(() => {
    if (success) {
      toast({
        title: "Invoice created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setForm({
        logo: Logo,
        from: {
          name: "",
          businessName: "",
          email: "",
          address: "",
          phone: "",
          businessNumber: "",
        },
        to: {
          name: "",
          email: "",
          address: "",
          phone: "",
          mobile: "",
          fax: "",
        },
        invoiceNumber: "",
        date: new Date().toISOString().split("T")[0],
        items: [
          { description: "", rate: 0, qty: 1, cgst: 0, sgst: 0, amount: 0 },
        ],
        notes: "",
      });
    }
    if (error) {
      toast({
        title: "Error creating invoice.",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [success, error, toast]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] =
      field === "description" ? value : parseFloat(value) || 0;

    // Calculate amount whenever rate or quantity changes
    if (field === "rate" || field === "qty") {
      newItems[index].amount = calculateItemAmount(newItems[index]);
    }

    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { description: "", rate: 0, qty: 1, cgst: 0, sgst: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleFromChange = (field, value) => {
    setForm({
      ...form,
      from: { ...form.from, [field]: value },
    });
  };

  const handleToChange = (field, value) => {
    setForm({
      ...form,
      to: { ...form.to, [field]: value },
    });
  };

  const handleSubmit = () => {
    if (!form.invoiceNumber || form.items.some((item) => !item.description)) {
      toast({
        title: "Missing required fields",
        description: "Invoice Number and Item descriptions are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update all amounts before submission (in case any were missed)
    const itemsWithUpdatedAmounts = form.items.map((item) => ({
      ...item,
      amount: calculateItemAmount(item),
    }));

    const invoiceData = {
      ...form,
      items: itemsWithUpdatedAmounts,
      subtotal,
      totalCgst,
      totalSgst,
      total,
    };

    dispatch(createBillingInvoice(invoiceData));
  };

  return (
    <Box p={4} maxW="1200px" mx="auto" m={10}>
      <VStack spacing={4} align="stretch">
        <img src={form.logo} alt="Logo" width="120" />

        <HStack>
          <Input
            placeholder="Invoice Number"
            value={form.invoiceNumber}
            onChange={(e) =>
              setForm({ ...form, invoiceNumber: e.target.value })
            }
          />{" "}
          <Button onClick={handleLoadInvoice} bg={"violet"} color={"black"}>
            Load
          </Button>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </HStack>
        {/* FROM Section */}
        <Text fontWeight="bold">From Address:</Text>
        <HStack>
          <Input
            placeholder="Name"
            value={form.from.name}
            onChange={(e) => handleFromChange("name", e.target.value)}
          />
          <Input
            placeholder="Business Name"
            value={form.from.businessName}
            onChange={(e) => handleFromChange("businessName", e.target.value)}
          />
        </HStack>
        <HStack>
          <Input
            placeholder="Email"
            value={form.from.email}
            onChange={(e) => handleFromChange("email", e.target.value)}
          />
          <Input
            placeholder="Address"
            value={form.from.address}
            onChange={(e) => handleFromChange("address", e.target.value)}
          />
        </HStack>
        <HStack>
          <Input
            placeholder="Phone"
            value={form.from.phone}
            onChange={(e) => handleFromChange("phone", e.target.value)}
          />
          <Input
            placeholder="Business Number"
            value={form.from.businessNumber}
            onChange={(e) => handleFromChange("businessNumber", e.target.value)}
          />
        </HStack>

        {/* TO Section */}
        <Text fontWeight="bold">Bill To:</Text>
        <HStack>
          <Input
            placeholder="Name"
            value={form.to.name}
            onChange={(e) => handleToChange("name", e.target.value)}
          />
          <Input
            placeholder="Email"
            value={form.to.email}
            onChange={(e) => handleToChange("email", e.target.value)}
          />
        </HStack>
        <HStack>
          <Input
            placeholder="Address"
            value={form.to.address}
            onChange={(e) => handleToChange("address", e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={form.to.phone}
            onChange={(e) => handleToChange("phone", e.target.value)}
          />
        </HStack>
        <HStack>
          <Input
            placeholder="Mobile"
            value={form.to.mobile}
            onChange={(e) => handleToChange("mobile", e.target.value)}
          />
          <Input
            placeholder="Fax"
            value={form.to.fax}
            onChange={(e) => handleToChange("fax", e.target.value)}
          />
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Description</Th>
              <Th>Rate</Th>
              <Th>Qty</Th>
              <Th>CGST (%)</Th>
              <Th>SGST (%)</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {form.items.map((item, i) => (
              <Tr key={i}>
                <Td>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(i, "description", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(i, "rate", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(i, "qty", e.target.value)}
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={item.cgst}
                    onChange={(e) =>
                      handleItemChange(i, "cgst", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={item.sgst}
                    onChange={(e) =>
                      handleItemChange(i, "sgst", e.target.value)
                    }
                  />
                </Td>
                <Td>{item.amount.toFixed(2)}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeItem(i)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button onClick={addItem}>Add Item</Button>

        <Divider />
        <Text>Subtotal: ₹{subtotal.toFixed(2)}</Text>
        <Text>CGST: ₹{totalCgst.toFixed(2)}</Text>
        <Text>SGST: ₹{totalSgst.toFixed(2)}</Text>
        <Text fontWeight="bold">Total: ₹{total.toFixed(2)}</Text>

        <Textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <Button colorScheme="cyan" onClick={handleSubmit}>
          Save Invoice
        </Button>
        <Button colorScheme="teal" onClick={() => setShowPDF(!showPDF)}>
          {showPDF ? "Hide Preview" : "Show PDF Preview"}
        </Button>
        <HStack>
          {showPDF && (
            <Box mt={10} border="1px" borderColor="gray.200" p={4} mx="auto">
              <InvoicePDF
                invoiceData={{
                  ...form,
                  subtotal,
                  totalCgst,
                  totalSgst,
                  total,
                }}
              />
            </Box>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default BillingInvoice;
