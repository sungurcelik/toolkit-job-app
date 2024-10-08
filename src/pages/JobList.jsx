import { useDispatch, useSelector } from "react-redux";
import { setLoading, setJobs, setError } from "../redux/slices/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import Loader from "../components/Loader";
import Card from "../components/Card";

const JobList = () => {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.jobSlice);

  // Api'den verileri alıp store'a aktarır.
  const fetchData = () => {
    // 1-) yüklenme durumunu güncelle
    dispatch(setLoading());
    axios
      .get("http://localhost:4000/jobs")
      // 2-) veri gelirse store'a aktar
      .then((res) => dispatch(setJobs(res.data)))
      // 3-) hata olursa store'u güncelle
      .catch((err) => dispatch(setError(err.message)));
  };
  // bileşen ekrana basıldığında
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="list-page">
      {/* 
    1) yüklenme devam ediyorsa loader bas
    2) Yüklenme bittiyse ve hata varsa hata mesajı ve tekrar butonu bas
    3) Yüklenme bitti ve hata yok --> kartları ekrana bas  
    */}
      {state.isLoading ? (
        <Loader />
      ) : state.isError ? (
        <div className="error">
          <p>
            Üzgünüz, verilere erişirken bir sorun oluştu{" "}
            <span>{state.isError}</span>{" "}
          </p>
          <button onClick={fetchData}>Tekrar Dene!</button>
        </div>
      ) : (
        <div className="job-list">
          {state.jobs.map((job) => (
            <Card job={job} key={job.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
