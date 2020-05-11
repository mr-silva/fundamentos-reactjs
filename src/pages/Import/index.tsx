import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [exportError, setExportError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) {
      setExportError(
        'Erro: É necessário ao menos um arquivo para poder importar.',
      );
      return;
    }

    const data = new FormData();

    const { file, name: fileName } = uploadedFiles[0];

    data.append('file', file, fileName);

    try {
      await api.post('/transactions/import', data);

      history.push('/');
      setExportError('');
    } catch (err) {
      setExportError(
        'Erro: Falha ao importar arquivo, campos incorretos ou arquivo vazio.',
      );
    }
  }

  function submitFile(files: File[]): void {
    const filesUpload = files.map((file: File) => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(filesUpload);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
          {exportError && <Error>{exportError}</Error>}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
