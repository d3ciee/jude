import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import winston from 'winston';
import OpenAIService from '../services/oai';  // Fixed path

// Setup logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'test.log' })
    ]
});

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..', '..', '..');

// Utility function to read file
async function readTestFile(filePath) {
    try {
        return await fs.readFile(filePath);
    } catch (error) {
        logger.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

// Test functions
async function testDocumentAnalysis() {
    try {
        const service = new OpenAIService(logger);
        
        // Test PDF analysis using sample from root
        const pdfPath = join(projectRoot, 'samples', 'claims sample.pdf');
        const pdfBuffer = await readTestFile(pdfPath);
        logger.info('Testing PDF analysis...');
        const pdfResult = await service.analyzeDocument(pdfBuffer, 'claims sample.pdf');
        logger.info('PDF analysis result:', pdfResult);

        // Test second PDF
        const pdf2Path = join(projectRoot, 'samples', 'sample claim 2.pdf');
        const pdf2Buffer = await readTestFile(pdf2Path);
        logger.info('Testing second PDF analysis...');
        const pdf2Result = await service.analyzeDocument(pdf2Buffer, 'sample claim 2.pdf');
        logger.info('Second PDF analysis result:', pdf2Result);

    } catch (error) {
        logger.error('Test failed:', error);
    }
}

async function testSocialProfiling() {
    try {
        const service = new OpenAIService(logger);
        
        logger.info('Testing social profiling...');
        const profileResult = await service.performSocialProfiling('Emerson Mnangagwa');
        logger.info('Social profiling result:', profileResult);

    } catch (error) {
        logger.error('Social profiling test failed:', error);
    }
}

async function testProviderProfiling() {
    try {
        const service = new OpenAIService(logger);
        
        logger.info('Testing provider profiling...');
        const providerResult = await service.performProviderProfiling('Cimas');
        logger.info('Provider profiling result:', providerResult);

    } catch (error) {
        logger.error('Provider profiling test failed:', error);
    }
}

// Main test runner
async function runTests() {
    logger.info('Starting OpenAI Service tests...');

    // Run tests
    await testDocumentAnalysis();
    await testSocialProfiling();
    await testProviderProfiling();

    logger.info('Tests completed');
}

// Run tests
runTests().catch(error => {
    logger.error('Test runner failed:', error);
    process.exit(1);
});
