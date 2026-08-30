package com.srishticonnect.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.srishticonnect.backend.entity.Product;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class PdfExportService {

    private final QrCodeService qrCodeService;

    public PdfExportService(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    public byte[] generateProductPdf(Product product, String baseUrl) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, out);

        document.open();

        // Color Palette
        Color terracotta = new Color(184, 74, 46);
        Color indigoDark = new Color(15, 23, 42);
        Color warmBg = new Color(250, 244, 235);
        Color borderWarm = new Color(230, 218, 203);
        Color lightGreen = new Color(22, 163, 74);
        Color mutedGray = new Color(100, 116, 139);

        // Standard Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, terracotta);
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, mutedGray);
        Font sectionHeading = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, indigoDark);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, indigoDark);
        Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(51, 65, 85));
        Font priceHighlight = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, terracotta);

        // 1. Header Banner
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{68, 32});

        PdfPCell leftHeader = new PdfPCell();
        leftHeader.setBorder(Rectangle.NO_BORDER);
        leftHeader.addElement(new Paragraph("SRISHTICONNECT", titleFont));
        leftHeader.addElement(new Paragraph("National Artisan Craft & Heritage Dossier", subTitleFont));
        leftHeader.addElement(new Paragraph("Official Digital Authenticity Pass • GI Verified", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, lightGreen)));
        headerTable.addCell(leftHeader);

        PdfPCell rightHeader = new PdfPCell();
        rightHeader.setBorder(Rectangle.NO_BORDER);
        rightHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);
        rightHeader.addElement(new Paragraph("Pass ID: ART-26090-" + (product.getId() != null ? product.getId() : "NEW"), boldFont));
        String dateStr = product.getCreatedAt() != null ? product.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        rightHeader.addElement(new Paragraph("Date: " + dateStr, regularFont));
        rightHeader.addElement(new Paragraph("Status: " + (product.getStatus() != null ? product.getStatus() : "Ready to Market"), boldFont));
        headerTable.addCell(rightHeader);

        document.add(headerTable);
        document.add(new Paragraph(" "));

        // 2. Product Visual & Main Highlights Table
        PdfPTable mainTable = new PdfPTable(2);
        mainTable.setWidthPercentage(100);
        mainTable.setWidths(new float[]{40, 60});

        // Left Cell: Product Image
        PdfPCell imageCell = new PdfPCell();
        imageCell.setBorderColor(borderWarm);
        imageCell.setBackgroundColor(warmBg);
        imageCell.setPadding(6);

        Image prodImg = null;
        if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
            try {
                if (product.getImageUrl().startsWith("data:image/")) {
                    String base64 = product.getImageUrl().substring(product.getImageUrl().indexOf(",") + 1);
                    byte[] imgBytes = Base64.getDecoder().decode(base64);
                    prodImg = Image.getInstance(imgBytes);
                } else if (product.getImageUrl().startsWith("http")) {
                    prodImg = Image.getInstance(product.getImageUrl());
                }
            } catch (Exception ignored) {}
        }

        if (prodImg != null) {
            prodImg.scaleToFit(180, 180);
            prodImg.setAlignment(Image.ALIGN_CENTER);
            imageCell.addElement(prodImg);
        } else {
            Paragraph placeholder = new Paragraph("[ Handcrafted Craft Image ]", subTitleFont);
            placeholder.setAlignment(Element.ALIGN_CENTER);
            imageCell.addElement(placeholder);
        }
        mainTable.addCell(imageCell);

        // Right Cell: Product Info & Pricing
        PdfPCell infoCell = new PdfPCell();
        infoCell.setBorderColor(borderWarm);
        infoCell.setPadding(8);

        String prodTitle = product.getTitle() != null ? product.getTitle() : "Handcrafted Artisan Creation";
        infoCell.addElement(new Paragraph(prodTitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, indigoDark)));

        String craftType = product.getCategory() != null ? product.getCategory() : "Handmade Craft";
        String region = product.getRegion() != null ? product.getRegion() : "India";
        infoCell.addElement(new Paragraph("Craft Type: " + craftType + "  •  Origin: " + region, boldFont));

        double price = product.getRecommendedPrice() != null ? product.getRecommendedPrice() : 0.0;
        infoCell.addElement(new Paragraph("Artisan Fair Price: INR " + (int) price, priceHighlight));

        infoCell.addElement(new Paragraph(" "));

        String artisanName = (product.getUser() != null && product.getUser().getName() != null)
                ? product.getUser().getName() : "Master Artisan (SrishtiConnect Member)";
        String craftCluster = (product.getUser() != null && product.getUser().getCraftCluster() != null && !product.getUser().getCraftCluster().isBlank())
                ? product.getUser().getCraftCluster() : region;
        String craftSpec = (product.getUser() != null && product.getUser().getCraftSpecialization() != null && !product.getUser().getCraftSpecialization().isBlank())
                ? product.getUser().getCraftSpecialization() : craftType;

        infoCell.addElement(new Paragraph("Master Artisan: " + artisanName, regularFont));
        infoCell.addElement(new Paragraph("Craft Cluster: " + craftCluster, regularFont));
        infoCell.addElement(new Paragraph("Craft Specialization: " + craftSpec, regularFont));
        infoCell.addElement(new Paragraph("Raw Material Cost: INR " + (product.getMaterialCost() != null ? product.getMaterialCost().intValue() : 250), regularFont));
        infoCell.addElement(new Paragraph("Crafting Time: " + (product.getLaborHours() != null ? product.getLaborHours().intValue() : 16) + " Hours", regularFont));

        mainTable.addCell(infoCell);
        document.add(mainTable);
        document.add(new Paragraph(" "));

        // 3. Craft Specifications Grid
        Paragraph specsTitle = new Paragraph("Craft Specifications & Authenticity", sectionHeading);
        document.add(specsTitle);

        PdfPTable specsTable = new PdfPTable(2);
        specsTable.setWidthPercentage(100);
        specsTable.setSpacingBefore(4);

        addSpecRow(specsTable, "Primary Material:", product.getMaterials() != null && !product.getMaterials().isBlank() ? product.getMaterials() : "Natural Raw Materials", boldFont, regularFont, borderWarm);
        addSpecRow(specsTable, "Color & Natural Dyes:", product.getColor() != null && !product.getColor().isBlank() ? product.getColor() : "Traditional Organic Palette", boldFont, regularFont, borderWarm);
        addSpecRow(specsTable, "Dimensions / Size:", product.getDimensions() != null && !product.getDimensions().isBlank() ? product.getDimensions() : "Standard Handcrafted Size", boldFont, regularFont, borderWarm);
        addSpecRow(specsTable, "Geographic Region:", region, boldFont, regularFont, borderWarm);
        addSpecRow(specsTable, "Craft Technique / Process:", product.getCraftProcess() != null && !product.getCraftProcess().isBlank() ? product.getCraftProcess() : "Heritage manual shaping and traditional finishing", boldFont, regularFont, borderWarm);
        addSpecRow(specsTable, "Cultural Significance:", product.getCulturalSignificance() != null && !product.getCulturalSignificance().isBlank() ? product.getCulturalSignificance() : "Preserves historic Indian folk art traditions", boldFont, regularFont, borderWarm);
        addSpecRow(specsTable, "Uniqueness & Heritage Value:", product.getUniqueness() != null && !product.getUniqueness().isBlank() ? product.getUniqueness() : "100% handmade authentic craft with zero synthetic substitutes", boldFont, regularFont, borderWarm);

        document.add(specsTable);
        document.add(new Paragraph(" "));

        // 4. Product Story / Multilingual Descriptions
        Paragraph storyTitle = new Paragraph("Craft Heritage Story & Buyer Description", sectionHeading);
        document.add(storyTitle);

        String descEn = product.getDescription() != null && !product.getDescription().isBlank() ? product.getDescription() : "Authentic handmade creation crafted with dedication.";
        Paragraph pEn = new Paragraph("English Description: " + descEn, regularFont);
        pEn.setSpacingBefore(3);
        document.add(pEn);

        if (product.getDescriptionHindi() != null && !product.getDescriptionHindi().isBlank()) {
            Paragraph pHi = new Paragraph("Hindi Description (हिन्दी): " + product.getDescriptionHindi(), regularFont);
            pHi.setSpacingBefore(2);
            document.add(pHi);
        }

        if (product.getDescriptionTelugu() != null && !product.getDescriptionTelugu().isBlank()) {
            Paragraph pTe = new Paragraph("Telugu Description (తెలుగు): " + product.getDescriptionTelugu(), regularFont);
            pTe.setSpacingBefore(2);
            document.add(pTe);
        }

        document.add(new Paragraph(" "));

        // 5. Digital QR Code & Verification Footer
        PdfPTable qrTable = new PdfPTable(2);
        qrTable.setWidthPercentage(100);
        qrTable.setWidths(new float[]{22, 78});
        qrTable.getDefaultCell().setBorderColor(borderWarm);

        String effectiveBaseUrl = (baseUrl != null && !baseUrl.isBlank()) ? baseUrl : "http://localhost:5173";
        // Remove trailing slash if present
        if (effectiveBaseUrl.endsWith("/")) {
            effectiveBaseUrl = effectiveBaseUrl.substring(0, effectiveBaseUrl.length() - 1);
        }
        String scanUrl = effectiveBaseUrl + "/item/" + product.getId();

        byte[] qrBytes = qrCodeService.generateQrCodeImage(scanUrl, 110, 110);
        Image qrImg = Image.getInstance(qrBytes);
        qrImg.scaleToFit(80, 80);
        qrImg.setAlignment(Image.ALIGN_CENTER);

        PdfPCell qrCell = new PdfPCell();
        qrCell.setBorderColor(borderWarm);
        qrCell.setPadding(4);
        qrCell.addElement(qrImg);
        qrTable.addCell(qrCell);

        PdfPCell qrTextCell = new PdfPCell();
        qrTextCell.setBorderColor(borderWarm);
        qrTextCell.setPadding(6);
        qrTextCell.addElement(new Paragraph("SCAN TO VIEW LIVE PUBLIC PRODUCT SHOWCASE", boldFont));
        qrTextCell.addElement(new Paragraph("Scan this QR code with any smartphone camera to open the full digital catalog card, artisan provenance, and direct buyer linkage portal without logging in.", regularFont));
        qrTextCell.addElement(new Paragraph("Public Link: " + scanUrl, FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, terracotta)));
        qrTable.addCell(qrTextCell);

        document.add(qrTable);

        // Footer Note
        Paragraph footer = new Paragraph("Generated by SrishtiConnect Artisan Platform • Protecting Indian Artisan Fair Wages and GI Heritage", FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(148, 163, 184)));
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }

    private void addSpecRow(PdfPTable table, String label, String value, Font labelFont, Font valFont, Color borderColor) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setBorderColor(borderColor);
        c1.setPadding(4);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, valFont));
        c2.setBorderColor(borderColor);
        c2.setPadding(4);
        table.addCell(c2);
    }
}
