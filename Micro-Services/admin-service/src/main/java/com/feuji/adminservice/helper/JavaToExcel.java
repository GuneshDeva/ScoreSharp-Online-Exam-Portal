package com.feuji.adminservice.helper;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.feuji.commonmodel.Question;

@Component
public class JavaToExcel {
	
	 private XSSFWorkbook workbook;
	    private XSSFSheet sheet;
	    private List<Question> listErrorQuestions;
	    
	
	    private ExcelHelper excelHelper = new ExcelHelper();
	     
	    public JavaToExcel(List<Question> listErrorQuestions) {
	        this.listErrorQuestions = listErrorQuestions ;
//	        System.err.println(listErrorQuestions+"=====================");
	        workbook = new XSSFWorkbook();
	    }
	 
	 
	    private void writeHeaderLine() {
	        sheet = workbook.createSheet("ErrorQuestions");
	         
	        Row row = sheet.createRow(0);
	         
	        CellStyle style = workbook.createCellStyle();
	        XSSFFont font = workbook.createFont();
	        font.setBold(true);
	        font.setFontHeight(16);
	        style.setFont(font);
	         
	        createCell(row, 0, "subject", style);      
	        createCell(row, 1, "topic", style);       
	        createCell(row, 2, "answer", style);    
	        createCell(row, 3, "content", style);
	        createCell(row, 4, "option_a", style);
	        createCell(row, 5, "option_b", style);
	        createCell(row, 6, "option_c", style);
	        createCell(row, 7, "option_d", style);
	        createCell(row, 8, "q-type", style);
	         
	    }
	     
	    private void createCell(Row row, int columnCount, Object value, CellStyle style) {
	        sheet.autoSizeColumn(columnCount);
	        Cell cell = row.createCell(columnCount);
	        if (value instanceof Integer) {
	            cell.setCellValue((Integer) value);
	        } else if (value instanceof Boolean) {
	            cell.setCellValue((Boolean) value);
	        }else {
	            cell.setCellValue((String) value);
	        }
	        cell.setCellStyle(style);
	    }
	     
	    private void writeDataLines() {
	        int rowCount = 1;
	 
	        CellStyle style = workbook.createCellStyle();
	        XSSFFont font = workbook.createFont();
	        font.setFontHeight(14);
	        style.setFont(font);
	        for (Question question :listErrorQuestions) {
	            Row row = sheet.createRow(rowCount++);
	            int columnCount = 0;
	            
	             if(question.getSubject() == null) {
	            	 createCell(row, columnCount++,"invalid subject" , style);
	            	 createCell(row, columnCount++,"invalid topic" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getSubject().getName() , style);
	            	 createCell(row, columnCount++,question.getSubject().getDescription() , style);
	             }
	            
	             if(question.getAnswer() == null) {
	            	 createCell(row, columnCount++,"Answer is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getAnswer() , style);
	             }
	             
	             if(question.getContent() == null) {
	            	 createCell(row, columnCount++,"Content is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getContent() , style);
	             }
	             
	             if(question.getOptionA() == null) {
	            	 createCell(row, columnCount++,"Option A is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getOptionA() , style);
	             }
	             
	             if(question.getOptionB() == null) {
	            	 createCell(row, columnCount++,"Option B is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getOptionB() , style);
	             }
	             
	             if(question.getOptionC() == null) {
	            	 createCell(row, columnCount++,"Option C is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getOptionC() , style);
	             }
	             
	             if(question.getOptionD() == null) {
	            	 createCell(row, columnCount++,"Option D is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getOptionD() , style);
	             }
	             
	             if(question.getQtype() == null) {
	            	 createCell(row, columnCount++," Q-Type  is null" , style);
	             } else {
	            	 createCell(row, columnCount++,question.getQtype() , style);
	             }
	             
	        }
	    }
	     
	    public void export(HttpServletResponse response) throws IOException {
	        writeHeaderLine();
	        writeDataLines();
	         
	        ServletOutputStream outputStream = response.getOutputStream();
	        workbook.write(outputStream);
	        workbook.close();
	         
	        outputStream.close();
	         
	    }

}
