/**
 * PDF Export utilities for diet plans
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DietPlan, Food, PatientProfile, NutritionalSummary } from '@/types';

/**
 * Generate PDF for diet plan
 */
export function generateDietPlanPDF(
  dietPlan: DietPlan,
  patientProfile?: PatientProfile,
  nutritionalSummary?: NutritionalSummary
): jsPDF {
  const doc = new jsPDF();
  let yPos = 20;

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Ayurvedic Diet Plan', 105, yPos, { align: 'center' });
  yPos += 10;

  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Patient Information Section
  if (patientProfile) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${patientProfile.name}`, 20, yPos);
    yPos += 5;
    doc.text(`Age: ${patientProfile.age} years | Gender: ${patientProfile.gender}`, 20, yPos);
    yPos += 5;
    
    if (patientProfile.height && patientProfile.weight && patientProfile.bmi) {
      doc.text(`Height: ${patientProfile.height} cm | Weight: ${patientProfile.weight} kg | BMI: ${patientProfile.bmi?.toFixed(1)}`, 20, yPos);
      yPos += 5;
    }
    
    doc.text(`Prakriti: ${patientProfile.prakriti}`, 20, yPos);
    yPos += 5;
    
    if (patientProfile.medicalConditions && patientProfile.medicalConditions.length > 0) {
      doc.text(`Medical Conditions: ${patientProfile.medicalConditions.filter(c => c !== 'None').join(', ') || 'None'}`, 20, yPos);
      yPos += 5;
    }
    
    yPos += 5;
  }

  // Nutritional Summary
  if (nutritionalSummary) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Nutritional Summary', 20, yPos);
    yPos += 7;

    const summaryData = [
      ['Calories', `${nutritionalSummary.totalCalories} kcal`],
      ['Protein', `${nutritionalSummary.totalProtein}g`],
      ['Carbohydrates', `${nutritionalSummary.totalCarbs}g`],
      ['Fats', `${nutritionalSummary.totalFats}g`],
      ['Fiber', `${nutritionalSummary.totalFiber}g`]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Nutrient', 'Amount']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [255, 153, 51] },
      margin: { left: 20, right: 20 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Meal Plans
  const meals: Array<{ title: string; foods: Food[] }> = [
    { title: 'Breakfast', foods: dietPlan.breakfast },
    { title: 'Lunch', foods: dietPlan.lunch },
    { title: 'Dinner', foods: dietPlan.dinner }
  ];

  if (dietPlan.snacks && dietPlan.snacks.length > 0) {
    meals.push({ title: 'Snacks', foods: dietPlan.snacks });
  }

  meals.forEach((meal, index) => {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(meal.title, 20, yPos);
    yPos += 5;

    const mealData = meal.foods.map(food => [
      food.name,
      food.category,
      `${food.calories} kcal`
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Food Item', 'Category', 'Calories']],
      body: mealData,
      theme: 'striped',
      headStyles: { fillColor: [102, 153, 255] },
      margin: { left: 20, right: 20 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  });

  // Meal Timings
  if (dietPlan.mealTimings && dietPlan.mealTimings.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Meal Timings', 20, yPos);
    yPos += 7;

    const timingData = dietPlan.mealTimings.map(timing => [
      timing.meal.charAt(0).toUpperCase() + timing.meal.slice(1),
      timing.recommendedTime,
      timing.description
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Meal', 'Time', 'Description']],
      body: timingData,
      theme: 'grid',
      headStyles: { fillColor: [153, 204, 153] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        2: { cellWidth: 80 }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Ayurvedic Guidelines
  if (dietPlan.guidelines && dietPlan.guidelines.length > 0) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Ayurvedic Guidelines', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    dietPlan.guidelines.forEach((guideline, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const lines = doc.splitTextToSize(`${idx + 1}. ${guideline}`, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-IN')} | Page ${i} of ${pageCount} | AyurBytes - Ayurvedic Diet Planner`,
      105,
      290,
      { align: 'center' }
    );
  }

  return doc;
}

/**
 * Download diet plan as PDF
 */
export function downloadDietPlanPDF(
  dietPlan: DietPlan,
  patientProfile?: PatientProfile,
  nutritionalSummary?: NutritionalSummary,
  filename?: string
): void {
  const doc = generateDietPlanPDF(dietPlan, patientProfile, nutritionalSummary);
  const fileName = filename || `AyurvedicDietPlan_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Get PDF as blob for sharing
 */
export function getDietPlanPDFBlob(
  dietPlan: DietPlan,
  patientProfile?: PatientProfile,
  nutritionalSummary?: NutritionalSummary
): Blob {
  const doc = generateDietPlanPDF(dietPlan, patientProfile, nutritionalSummary);
  return doc.output('blob');
}

/**
 * Share diet plan via Web Share API (if supported)
 */
export async function shareDietPlanPDF(
  dietPlan: DietPlan,
  patientProfile?: PatientProfile,
  nutritionalSummary?: NutritionalSummary
): Promise<boolean> {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }

  try {
    const blob = getDietPlanPDFBlob(dietPlan, patientProfile, nutritionalSummary);
    const file = new File(
      [blob],
      `AyurvedicDietPlan_${new Date().toISOString().split('T')[0]}.pdf`,
      { type: 'application/pdf' }
    );

    await navigator.share({
      title: 'Ayurvedic Diet Plan',
      text: 'Check out your personalized Ayurvedic diet plan!',
      files: [file]
    });

    return true;
  } catch (error) {
    console.error('Error sharing PDF:', error);
    return false;
  }
}
