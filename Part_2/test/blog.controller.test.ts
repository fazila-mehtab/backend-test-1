import request from "supertest";
import app from "../app";
import fs from "fs";

const imagePath = process.cwd() + "/images";

describe("Add blog post succeeded Test", () => {
  it("Should return the added blog that matches the request ", async () => {
    let data = fs.readFileSync(process.cwd() + "/blogs.json", "utf-8");
    let parseData = JSON.parse(data);
    const expResponse = {
      reference: "0000" + (Object.keys(parseData).length + 1),
      title: "New blog",
      description: "Description for new blog",
      date_time: 1680193025,
      main_image: "images/main_image_1_test.jpg",
    };
    const response = await request(app)
      .post("/blog")
      .attach("main_image", imagePath + "/main_image_1_test.jpg")
      .field({
        title: "New blog",
        description: "Description for new blog",
        date_time: 1680193025,
      });

    expect(response.body.data.title).toEqual(expResponse.title);
    expect(response.body.data.description).toEqual(expResponse.description);
    expect(response.body.data.date_time).toEqual(expResponse.date_time);
    expect(response.body.data.reference).toEqual(expResponse.reference);
    expect(response.body.data.main_image).not.toBeNull();
  });
});

describe("Add blog post failed Tests", () => {
  describe("Add partial blog post fields", () => {
    it("Request sent without required field title should return error ", async () => {
      const expResponse = '"title" is required';
      const response = await request(app)
        .post("/blog")
        .attach("main_image", imagePath + "/main_image_1_test.jpg")
        .field({
          description: "Description for new blog",
          date_time: 1679982850,
        });
      expect(response.text).toEqual(expResponse);
    });
  });

  describe("Add full blog post fields with main_image that exceeds 1MB", () => {
    it("Should respond with exceeded image size of 1MB", async () => {
      const expResponse = "File too large";
      const response = await request(app)
        .post("/blog")
        .attach("main_image", imagePath + "/2mb-01439-1600x1067.jpg")
        .field({
          title: "New blog",
          description: "Description for new blog",
          date_time: 1680193025,
        });
      expect(response.text).toEqual(expResponse);
    });
  });

  describe("Add full blog post fields with title that has special characters", () => {
    it("Request with special character title will respond with pattern not matched", async () => {
      const expResponse =
        '"title" with value "- Blog with $ char" fails to match the required pattern: /^[a-zA-Z0-9\\s]*$/';
      const response = await request(app)
        .post("/blog")
        .attach("main_image", imagePath + "/main_image_1_test.jpg")
        .field({
          title: "- Blog with $ char",
          description: "Description for new blog",
          date_time: 1680193025,
        });
      expect(response.text).toEqual(expResponse);
    });
  });

  describe("Add full blog post fields with ISO date_time", () => {
    it("Should show error must be a valid date", async () => {
      const expResponse = '"date_time" must be a valid date';
      const response = await request(app)
        .post("/blog")
        .attach("main_image", imagePath + "/main_image_1_test.jpg")
        .field({
          title: "New blog",
          description: "Description for new blog",
          date_time: "2022-09-07T16:32:04.093Z",
        });
      expect(response.text).toEqual(expResponse);
    });
  });
});

describe("Add blog post then Get all blog posts successful Test", () => {
  it("Add valid blog and check it was successfully added", async () => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let data = fs.readFileSync(process.cwd() + "/blogs.json", "utf-8");
    let parseData = JSON.parse(data);
    const expResponse = {
      reference: "0000" + (Object.keys(parseData).length + 1),
      title: "New Blog",
      description: "Description for new blog",
      date_time: 1680193025,
      main_image: uniqueSuffix + "jpg",
    };

    const response = await request(app)
      .post("/blog")
      .attach("main_image", imagePath + "/main_image_1_test.jpg")
      .field({
        title: "New Blog",
        description: "Description for new blog",
        date_time: 1680193025,
      });

    const getBlogs = await request(app).get("/blogs");

    const allBlogs = JSON.parse(getBlogs.text);
    const lastBlog = allBlogs.data[allBlogs.data.length - 1];
    expect(lastBlog.title).toEqual(expResponse.title);
    expect(lastBlog.description).toEqual(expResponse.description);
    expect(lastBlog.date_time).toEqual(expResponse.date_time);
    expect(lastBlog.reference).toEqual(expResponse.reference);
    expect(lastBlog.main_image).not.toBeNull();
  });
});

describe("Add blog post then Get all blog posts failed Test", () => {
  it("Add invalid blog and checks its not added", async () => {
    const blogs = await request(app).get("/blogs");
    const allBlogs = JSON.parse(blogs.text);

    const response = await request(app)
      .post("/blog")
      .attach("main_image", imagePath + "/main_image_1_test.jpg")
      .field({
        title: "New blog",
        date_time: 1680193025,
      });

    const finalBlogs = await request(app).get("/blogs");
    const allFinalBlogs = JSON.parse(finalBlogs.text);

    expect(allBlogs.length).toEqual(allFinalBlogs.length);
  });
});

describe("Get token from Generate token API and send to Get image by token API successful Test", () => {
  it("Check if it returns the image data successfully", async () => {
    const response = await request(app).post("/token").send({
      path: "main_image_1_test.jpg",
    });

    const token = response.body.data;
    const imageResponse = await request(app)
      .get("/image?token=" + token + "&path=main_image_1_test.jpg")
      .send();

    expect(imageResponse.headers["content-type"]).toEqual("image/jpeg");
  });
});

describe("Get token from Generate token API and send to Get image by token API failed Test", () => {
  it("Check if it returns the same bad token with different image path", async () => {
    const expResponse = "Invalid token";

    const response = await request(app).post("/token").send({
      path: "main_image_1_test.jpg",
    });

    const token = response.body.data;
    console.log(token);
    const imageResponse = await request(app)
      .get("/image?token=" + token + "&path=main_image_2_test.jpg")
      .send();

    expect(imageResponse.text).toEqual(expResponse);
  });
});
