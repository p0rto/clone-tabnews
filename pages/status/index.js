import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return <h3>Carregando...</h3>;
  }

  const { updated_at } = data;

  let updatedAtText = new Date(updated_at).toLocaleString("pt-BR");

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    const databaseData = data.dependencies.database;
    databaseStatusInformation = (
      <div>
        <h2>Banco de Dados</h2>
        <div>Versão: {databaseData.version}</div>
        <div>Máximo de conexões: {databaseData.max_connections}</div>
        <div>Conexões abertas: {databaseData.opened_connections}</div>
      </div>
    );
  }

  return databaseStatusInformation;
}
