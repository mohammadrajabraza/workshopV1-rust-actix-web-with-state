use crate::{Student, Students};
use actix_web::http::{StatusCode};
use actix_web::{delete, get, post, put, web, HttpResponse};

#[get("/")]
async fn index() -> HttpResponse {
    HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../static/index.html"))
    
}
// #[get("/app")]
// async fn js_file() -> HttpResponse {
//     HttpResponse::build(StatusCode::OK)
//         .body(include_str!("../static/app.js"))
// }

// This route handler will list all the data available
#[get("/students")]
async fn find_all() -> HttpResponse {
    let students = Students::find_all();
    HttpResponse::Ok().body(format!("List of students : {:?}",students))
}

// This route handler will list data with specific id
#[get("/students/{id}")]
async fn find(id: web::Path<i32>) -> HttpResponse {
    let student = Students::find(id.into_inner());
    HttpResponse::Ok().body(format!("Fetched Record : {:?}",student))
}

// This route handler will create a new record
#[post("/students")]
async fn create(student : web::Json<Student>) -> HttpResponse {
    let student = Students::create(student.into_inner());
    HttpResponse::Ok().json(student)
}

// This route handler will update an existing record
#[put("/students/{id}")]
async fn update(id : web::Path<i32>, student : web::Json<Student>) -> HttpResponse {
    let student = Students::update(id.into_inner(), student.into_inner());
    HttpResponse::Ok().json(student)

}

// This route handler will delete an specified record
#[delete("/students/{id}")]
async fn delete(id: web::Path<i32>) -> HttpResponse {
    let student = Students::delete(id.into_inner());
    HttpResponse::Ok().json(student)
}

// this function will initialize all the route handlers
pub fn init_routes(config: &mut web::ServiceConfig) {
    config.service(find_all);
    config.service(find);
    config.service(create);
    config.service(update);
    config.service(delete);

    config.service(index);
    
}