import React, {
  useState,
  useEffect,
} from "react";
import { Auth, Hub } from "aws-amplify";
import Amplify from "aws-amplify";
import config from "./aws-exports.js";

import {
  Alert,
  Button,
  Heading,
  ToggleButton,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  ThemeProvider,
  Theme,
  SelectField,
  useTheme,
} from "@aws-amplify/ui-react";
import { AiTwotoneDelete } from "react-icons/ai";
import TextareaAutosize from "react-textarea-autosize";
import "@aws-amplify/ui-react/styles.css";

import Page from "./Page";

Amplify.configure(config);

function App() {
  // User variable for midway authentication
  const [user, setUser] = useState(null);
  // For midway authentication: use effect
  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          console.log(event);
          console.log(data);
          getUser().then((userData) => setUser(userData));
          // Trying to get the user token
          console.log(user)
          console.log(user.signInUserSession.idToken.jwtToken)
          // console.log(user[signInUserSession])
          console.log(data.signInUserSession.idToken)
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
          console.log("Sign in failure", data);
          break;
      }
    });
    getUser().then((userData) => setUser(userData));
  }, []);
  // For midway authentication: Get user
  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log("Not signed in"));
  }

  // For form
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState("");
  const [claim, setClaim] = useState("");
  const [winloss, setWinloss] = useState("");
  const [priority, setPriority] = useState("");
  const [serviceteam, setServiceteam] = useState("");
  const [use, setUse] = useState("");

  // Styling for the signin and out button
  const { tokens } = useTheme();

  // Table Theme
  const theme: Theme = {
    name: "table-theme",
    tokens: {
      components: {
        table: {
          row: {
            hover: {
              backgroundColor: { value: "{colors.blue.20}" },
            },
            striped: {
              backgroundColor: { value: "{colors.blue.10}" },
            },
          },
          header: {
            color: { value: "{colors.blue.80}" },
            fontSize: { value: "{fontSizes.xl}" },
          },
          data: {
            fontWeight: { value: "{fontWeights.semibold}" },
          },
        },
      },
    },
  };

  // For Gobjs
  const [gobjs, setGobjs] = useState([]);

  // Fetch the gobjs in the table
  async function fetchGobjs() {
    const headers = {
      "Content-Type": "application, json",
    };
    const apiResponse = await fetch(
      "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/read",
      { headers }
    );
    const apiResponseJSON = await apiResponse.json();
    const gs = apiResponseJSON.body;
    // console.log(apiResponseJSON)
    console.log(gs);
    setGobjs([...gs]);
  }
  // Fetch the gobjs in the table: UseEffect
  useEffect(() => {
    async function fetc() {
      const headers = {
        "Content-Type": "application, json",
      };
      const apiResponse = await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/read",
        { headers }
      );
      const apiResponseJSON = await apiResponse.json();
      const gs = apiResponseJSON.body;
      // console.log(apiResponseJSON)
      // console.log("This is gs: " + gs)
      setGobjs([...gs]);
    }
    fetc();
  }, []);

  // Creating gobjs
  async function createGobj() {
    setUse("testUser");
    console.log(use);
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      customer: customer,
      service: service,
      claim: claim,
      winloss: winloss,
      priority: priority,
      serviceteam: serviceteam,
      user: user.username,
      // user: 'amazonfederate_hugotp'
    });
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // make API call with parameters and use promises to get response
    await fetch(
      "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/put",
      requestOptions
    )
      .then((response) => response.text())
      // .then((result) => alert(JSON.parse(result).body))
      .catch((error) => console.log("error", error));
    setCustomer("");
    setService("");
    setClaim("");
    setWinloss("");
    setPriority("");
    setServiceteam("");
    fetchGobjs();
    setAdding(!adding);
    // For pagination
    setCurrentPage(Math.ceil((gobjs.length + 1) / postsPerPage));
  }

  // Delete gobj
  async function deleteGobj({ gobj }) {
    console.log(gobj.id);
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ id: gobj.id });
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    // make API call with parameters and use promises to get response
    await fetch(
      "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/delete",
      requestOptions
    )
      .then((response) => response.text())
      // .then((result) => alert(JSON.parse(result).body))
      .catch((error) => console.log("error", error));
    fetchGobjs();
  }

  // Editing gobj
  async function editGobj(gobj) {
    console.log(editid);
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // Customer
    if (customer != "") {
      console.log("Customer variable not empty");
      var rawCustomer = JSON.stringify({ id: editid, customer: customer });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptionsCustomer = {
        method: "PUT",
        headers: myHeaders,
        body: rawCustomer,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/edit",
        requestOptionsCustomer
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));
    }
    // Service
    if (service != "") {
      console.log("Service variable not empty");
      var rawService = JSON.stringify({ id: editid, service: service });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptionsService = {
        method: "PUT",
        headers: myHeaders,
        body: rawService,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/edit",
        requestOptionsService
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));
    }
    // Claim
    if (claim != "") {
      console.log("Claim variable not empty");
      var rawClaim = JSON.stringify({ id: editid, claim: claim });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptionsClaim = {
        method: "PUT",
        headers: myHeaders,
        body: rawClaim,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/edit",
        requestOptionsClaim
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));
    }
    // Winloss
    if (winloss != "") {
      console.log("Winloss variable not empty");
      var rawWinloss = JSON.stringify({ id: editid, winloss: winloss });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptionsWinloss = {
        method: "PUT",
        headers: myHeaders,
        body: rawWinloss,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/edit",
        requestOptionsWinloss
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));
    }
    // Priority
    if (priority != "") {
      console.log("Priority variable not empty");
      var rawPriority = JSON.stringify({ id: editid, priority: priority });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptionsPriority = {
        method: "PUT",
        headers: myHeaders,
        body: rawPriority,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/edit",
        requestOptionsPriority
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));
    }
    if (serviceteam != "") {
      console.log("Serviceteam variable not empty");
      var rawServiceTeam = JSON.stringify({
        id: editid,
        serviceteam: serviceteam,
      });
      // create a JSON object with parameters for API call and store in a variable
      var requestOptionsServiceteam = {
        method: "PUT",
        headers: myHeaders,
        body: rawServiceTeam,
        redirect: "follow",
      };
      // make API call with parameters and use promises to get response
      await fetch(
        "https://qf9iv4xg4d.execute-api.us-west-2.amazonaws.com/v1/edit",
        requestOptionsServiceteam
      )
        .then((response) => response.text())
        .catch((error) => console.log("error", error));
    }
    setCustomer("");
    setService("");
    setClaim("");
    setWinloss("");
    setPriority("");
    setServiceteam("");
    fetchGobjs();
    clear();
  }

  // Adding
  const [adding, setAdding] = useState(false);
  // Change adding
  async function changeAdding() {
    if (adding == false) {
      if (editid != "") {
        setEditid("");
      }
    }
    // Set the adding variable
    setAdding(!adding);
  }

  // Editing
  const [editid, setEditid] = useState("");
  // Use effect for editing
  useEffect(() => {
    setEditid(editid);
    console.log("useEffect Edit ID = " + editid);
  }, [editid]);
  // Set the edit id
  async function change({ gobj }) {
    const x = gobj.id;
    setEditid(x);
    if (adding) {
      setAdding(false);
    }
    fetchGobjs();
  }

  // Clearing adding and editid
  async function clear() {
    setAdding(false);
    setEditid("");
  }

  // Controlling who can edit and delete
  // async function showUser() {
  //   console.log(user);
  // }

  // Pagination (only runs when it mounts)
  const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  // Pagination, change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // console.log(posts);
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  // const currentGobjs = gobjs.slice(indexOfFirstPost, indexOfLastPost);
  const [currentGobjs, setCurrentgobjs] = useState([]);
  // Pagination Use Effects
  useEffect(() => {
    setCurrentgobjs(gobjs.slice(indexOfFirstPost, indexOfLastPost));
  }, [gobjs, indexOfFirstPost, indexOfLastPost]);
  // Pagination Use Effects
  useEffect(() => {
    setCurrentPage(currentPage);
  }, [gobjs, currentPage]);

  return (
    <div className="App">
      {/* Production Change */}
      {user ? (
        <>
          <div className="signInAndOutDiv">
            {/* Sign out button */}
            <Button
              backgroundColor={tokens.colors.pink[40]}
              onClick={() => Auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
          <Heading level={1}>Dashboard</Heading>

          {/* Pagination Component */}
          {/* <Page postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} gobjs={gobjs}></Page> */}
          {gobjs.length > 0 ? (
            <>
              <p>
                Showing {indexOfFirstPost + 1} to{" "}
                {indexOfLastPost > gobjs.length
                  ? gobjs.length
                  : indexOfLastPost}{" "}
                of {gobjs.length} rows
              </p>
              <Page
                postsPerPage={postsPerPage}
                totalPosts={gobjs.length}
                paginate={paginate}
                gobjs={gobjs}
              ></Page>
            </>
          ) : (
            <></>
          )}

          <div className="tableDiv">
            <ThemeProvider theme={theme} colorMode="light">
              <Table highlightOnHover variation="striped">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>User</b>
                    </TableCell>
                    <TableCell className="theadCell">
                      <b>
                        Customer, SA, <i>Gap</i>
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>Service</b>
                    </TableCell>
                    <TableCell>
                      <b>GCP Claim / Customer Feedback</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        Win / Loss to GCP? Key factor resulting in loss and
                        learnings
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>Priority / AWS GCP Compete Team Response</b>
                    </TableCell>
                    <TableCell>
                      <b>Service Team PFR / Roadmap</b>
                    </TableCell>
                    <TableCell>
                      <ToggleButton onClick={() => changeAdding()}>
                        {adding ? <>HIDE</> : <>ADD </>}
                      </ToggleButton>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {adding ? (
                    <>
                      <TableRow>
                        {/* User */}
                        <TableCell>
                          {/* Production */}
                          {user.username.slice(15)}
                          {/* testUser */}
                        </TableCell>
                        <TableCell>
                          {/* Customer */}
                          <TextareaAutosize
                            className="responsiveTA"
                            // defaultValue={}
                            placeholder="Type here..."
                            onChange={(e) => setCustomer(e.target.value)}
                            value={customer}
                          />
                        </TableCell>
                        <TableCell>
                          {/* Service */}
                          <TextareaAutosize
                            className="responsiveTA"
                            // defaultValue={}
                            placeholder="Type here..."
                            onChange={(e) => setService(e.target.value)}
                            value={service}
                          />
                        </TableCell>
                        <TableCell>
                          {/* Claim */}
                          <TextareaAutosize
                            className="responsiveTA"
                            // defaultValue={}
                            placeholder="Type here..."
                            onChange={(e) => setClaim(e.target.value)}
                            value={claim}
                          />
                        </TableCell>
                        <TableCell>
                          {/* Win/Loss */}
                          <TextareaAutosize
                            className="responsiveTA"
                            // defaultValue={}
                            placeholder="Type here..."
                            onChange={(e) => setWinloss(e.target.value)}
                            value={winloss}
                          />
                        </TableCell>
                        <TableCell>
                          <SelectField
                            placeholder="Select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                          >
                            <option
                              value="Priority: High"
                              fontSize="var(--amplify-font-sizes-small)"
                            >
                              High
                            </option>
                            <option
                              value="Priority: Medium"
                              fontSize="var(--amplify-font-sizes-small)"
                            >
                              Medium
                            </option>
                            <option
                              value="Priority: Low"
                              fontSize="var(--amplify-font-sizes-small)"
                            >
                              Low
                            </option>
                          </SelectField>
                        </TableCell>
                        <TableCell>
                          {/* Service Team */}
                          <TextareaAutosize
                            className="responsiveTA"
                            // defaultValue={}
                            placeholder="Type here..."
                            onChange={(e) => setServiceteam(e.target.value)}
                            value={serviceteam}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <Button
                              loadingText=""
                              onClick={() => createGobj()}
                              ariaLabel=""
                              className="submitAndCancel"
                            >
                              Submit
                            </Button>
                          </div>
                          <div>
                            <Button
                              loadingText=""
                              onClick={() => clear()}
                              ariaLabel=""
                              className="submitAndCancel"
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* Mapping the gobjs */}
                  {gobjs.length > 0 ? (
                    currentGobjs.map((gobj) => (
                      <>
                        {gobj.id == editid ? (
                          <>
                            {/* Row for editing */}
                            <TableRow>
                              {/* User */}
                              <TableCell>
                                {gobj.user.slice(15)}
                                <br />
                                <br />
                              </TableCell>
                              <TableCell>
                                {/* Customer */}
                                <TextareaAutosize
                                  className="responsiveTA"
                                  // defaultValue={}
                                  placeholder="..."
                                  onChange={(e) => setCustomer(e.target.value)}
                                  defaultValue={gobj.customer}
                                />
                              </TableCell>
                              <TableCell>
                                {/* Service */}
                                <TextareaAutosize
                                  className="responsiveTA"
                                  // defaultValue={}
                                  placeholder="..."
                                  onChange={(e) => setService(e.target.value)}
                                  defaultValue={gobj.service}
                                />
                              </TableCell>
                              <TableCell>
                                {/* Claim */}
                                <TextareaAutosize
                                  className="responsiveTA"
                                  // defaultValue={}
                                  placeholder="..."
                                  onChange={(e) => setClaim(e.target.value)}
                                  defaultValue={gobj.claim}
                                />
                              </TableCell>
                              <TableCell>
                                {/* Win/Loss */}
                                <TextareaAutosize
                                  className="responsiveTA"
                                  // defaultValue={}
                                  placeholder="..."
                                  onChange={(e) => setWinloss(e.target.value)}
                                  defaultValue={gobj.winloss}
                                />
                              </TableCell>
                              <TableCell>
                                <SelectField
                                  placeholder="Select"
                                  value={priority}
                                  onChange={(e) => setPriority(e.target.value)}
                                >
                                  <option
                                    value="Priority: High"
                                    fontSize="var(--amplify-font-sizes-small)"
                                  >
                                    High
                                  </option>
                                  <option
                                    value="Priority: Medium"
                                    fontSize="var(--amplify-font-sizes-small)"
                                  >
                                    Medium
                                  </option>
                                  <option
                                    value="Priority: Low"
                                    fontSize="var(--amplify-font-sizes-small)"
                                  >
                                    Low
                                  </option>
                                </SelectField>
                              </TableCell>
                              <TableCell>
                                {/* Service Team */}
                                <TextareaAutosize
                                  className="responsiveTA"
                                  // defaultValue={}
                                  placeholder="..."
                                  onChange={(e) =>
                                    setServiceteam(e.target.value)
                                  }
                                  defaultValue={gobj.serviceteam}
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <Button
                                    loadingText=""
                                    onClick={() => editGobj({ gobj })}
                                    ariaLabel=""
                                    className="submitAndCancel"
                                  >
                                    Submit
                                  </Button>
                                </div>
                                <div>
                                  <Button
                                    loadingText=""
                                    onClick={() => clear()}
                                    ariaLabel=""
                                    className="submitAndCancel"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        ) : (
                          <>
                            <TableRow key={gobj.id}>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                <a
                                  href={`https://phonetool.amazon.com/users/${gobj.user.slice(
                                    15
                                  )}`}
                                  target="_blank"
                                >
                                  {gobj.user.slice(15)}
                                </a>
                                {/* <br/> */}
                                {/* <br/> */}
                                {/* {gobj.created_at.slice(0,-5)} */}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {gobj.customer}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {gobj.service}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {gobj.claim}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {gobj.winloss}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {gobj.priority}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {gobj.serviceteam}
                              </TableCell>
                              <TableCell fontSize="var(--amplify-font-sizes-small)">
                                {/* If user equals user.username */}
                                {/* Production */}
                                {gobj.user == user.username ? (
                                  <>
                                    <div>
                                      <Button onClick={() => change({ gobj })}>
                                        EDIT
                                      </Button>
                                    </div>
                                    <div className="deletIconDiv">
                                      <AiTwotoneDelete
                                        className="deleteIcon"
                                        onDoubleClick={() =>
                                          deleteGobj({ gobj })
                                        }
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </TableCell>
                            </TableRow>
                          </>
                        )}
                      </>
                    ))
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan="8">
                          There is no data in this dashboard.
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </ThemeProvider>
          </div>
        </>
      ) : (
        <>
          {/* To be shown when the user is not signed in */}
          <Alert variation="info">Please sign-in to view the dashboard.</Alert>
          <div className="signInAndOutDiv">
            <Button
              backgroundColor={tokens.colors.pink[40]}
              onClick={() =>
                Auth.federatedSignIn({ customProvider: "AmazonFederate" })
              }
              className="signInAndOut"
            >
              Sign-In with Midway
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;