import axios from "axios";

const BuildClient = ({req}) => {
  // typeofはstringにする
  if(typeof window === "undefined") {
    // we are on the server!
    // requests should be made to http://ingress-nginx.ingress-nginx-srv.asdfg
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers
    })
  } else {
    // we are on the browser!
    // requests can be made with a base url of ""
    return axios.create({
      baseURL: "/"
    })
  }
}

export default BuildClient;