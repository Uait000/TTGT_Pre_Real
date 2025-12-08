// src/utils/migrate-accessible-documents.ts
import accessibleEnvironmentApi from '@/api/accessible-environment';
import documentsApi from '@/api/documents';
import { PostCategory } from '@/api/posts';

export async function migrateExistingAccessibleDocuments() {
  try {
    console.log('🔄 Миграция существующих документов доступной среды...');
    
    // Получаем все документы
    const allDocuments = await documentsApi.getAll();
    
    // Фильтруем документы, которые относятся к доступной среде
    const accessibleEnvDocs = allDocuments.filter(doc => 
      accessibleEnvironmentApi.ACCESSIBLE_ENV_SECTIONS.includes(doc.section_title)
    );
    
    console.log(`📋 Найдено ${accessibleEnvDocs.length} документов для миграции`);
    
    // Мигрируем каждый документ
    for (const doc of accessibleEnvDocs) {
      try {
        console.log(`🔄 Миграция документа: ${doc.document_title}`);
        
        // Создаем новый документ в правильной категории
        await accessibleEnvironmentApi.create({
          section_title: doc.section_title,
          document_title: doc.document_title,
          is_published: doc.is_published,
          use_external_link: doc.use_external_link,
          external_link: doc.external_link || '',
          file_name: doc.file_name || '',
          file_url: doc.file_url || '',
          files: doc.files ? doc.files.map(f => f.id) : [],
          publish_date: doc.publish_date
        });
        
        // Удаляем старый документ (опционально)
        // await documentsApi.delete(doc.id);
        
        console.log(`✅ Документ мигрирован: ${doc.document_title}`);
      } catch (error) {
        console.error(`❌ Ошибка миграции документа ${doc.document_title}:`, error);
      }
    }
    
    console.log('✅ Миграция завершена');
  } catch (error) {
    console.error('❌ Ошибка миграции:', error);
  }
}