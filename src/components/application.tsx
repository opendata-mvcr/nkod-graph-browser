import {FC} from "react";
import {Container, Nav, Navbar, NavbarBrand,} from "reactstrap";
import {DatasetHeader} from "./dataset-header";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/style.css";
import "../styles/style-mode-default.css";
import "../styles/style-mode-dark.css";
import '../index.css';
import {Graph} from "../graph-ui/graph";
import {SetIri} from "./set-iri";
import {NkodDatasetAdapter} from "../nkod/nkod-dataset-adapter";
import {httpFetch} from "../io/fetch/fetch-browser";
import {useDataset} from "../processing/use-dataset";
import {SgovOntologyAdapter} from "../nkod/sgov-ontology-adapter";
import {useFetchedGraphFromDataset} from "../processing/use-fetched-graph-from-dataset";
import LanguageSelector from "./language-selector";

// Process URL parameters and do simple routing
const urlParams = new URLSearchParams(window.location.search);
const datasetIri = urlParams.get("iri");

// Setup adapters
const nkodAdapter = new NkodDatasetAdapter(process.env.REACT_APP_DATASETS_SPARQL_URL, httpFetch);
const sgovAdapter = new SgovOntologyAdapter(process.env.REACT_APP_SGOV_SPARQL_URL, httpFetch);

export const Application: FC = () => {
  const [dataset] = useDataset(datasetIri, nkodAdapter);
  const [graph] = useFetchedGraphFromDataset(dataset ?? undefined, sgovAdapter);

  return <>
    <div>
      <Navbar expand="md" container="lg">
        <NavbarBrand href="/">
          <img
            width="174" height="30"
            alt={"sdf"}
            className="d-inline-block align-top"
            src="logo.png"
            id="sdf"
          />
        </NavbarBrand>
        <Nav className="ms-auto" navbar>
          <LanguageSelector/>
        </Nav>
      </Navbar>
      <Container>
        {!datasetIri ?
          <SetIri /> :
          <>
            {dataset ?
              <DatasetHeader dataset={dataset} /> :
              <>
                <h1 style={{width: "30%", backgroundColor: "#88888811", borderRadius: "20px"}}>&nbsp;</h1>
                <p style={{width: "50%", backgroundColor: "#88888811", borderRadius: "10px"}}>&nbsp;</p>
              </>
            }
            <hr/>
          </>
        }
      </Container>
    </div>
    {!!datasetIri && !graph && <div className={"align-items-center justify-content-center d-flex flex-grow-1"}>
        <div className="spinner-border" role="status">
            <span className="sr-only"></span>
        </div>
    </div>}
    {graph && <Graph graph={graph} />}
  </>;
}
