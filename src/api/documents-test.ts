// src/api/documents-test.ts
export interface Document {
  id: number;
  section_title: string;
  document_title: string;
  file_url: string;
  file_name?: string;
  is_published: boolean;
  use_external_link: boolean;
  external_link?: string;
  created_at: string;
  updated_at: string;
  files?: any[];
}

export const documentsApi = {
  async getPublicAll(): Promise<Document[]> {
    // Временные тестовые данные
    const testDocuments: Document[] = [
      {
        id: 1,
        section_title: 'Организационные документы и приказы',
        document_title: 'Положение о Тихорецком техникуме железнодорожного транспорта',
        file_url: '/files/test1.pdf',
        file_name: 'polozhenie_ttgt.pdf',
        is_published: true,
        use_external_link: false,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        files: [
          {
            id: 'file1',
            name: 'polozhenie_ttgt.pdf',
            mime: 'application/pdf'
          }
        ]
      },
      {
        id: 2,
        section_title: 'Образовательная деятельность',
        document_title: 'Положение о практической подготовке обучающихся',
        file_url: '/files/test2.pdf',
        file_name: 'polozhenie_praktika.pdf',
        is_published: true,
        use_external_link: false,
        created_at: '2024-01-10',
        updated_at: '2024-01-10',
        files: [
          {
            id: 'file2',
            name: 'polozhenie_praktika.pdf',
            mime: 'application/pdf'
          }
        ]
      },
      {
        id: 3,
        section_title: 'Организационные документы и приказы',
        document_title: 'Приказ РГУПС от 08.12.15 № 1829/ос',
        file_url: 'https://example.com/document.pdf',
        is_published: true,
        use_external_link: true,
        external_link: 'https://example.com/document.pdf',
        created_at: '2024-01-08',
        updated_at: '2024-01-08',
        files: []
      }
    ];

    console.log('📄 Используются тестовые документы:', testDocuments);
    return testDocuments;
  }
};

export default documentsApi;