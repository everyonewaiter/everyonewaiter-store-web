describe("Login Flow", () => {
  beforeEach(() => {
    cy.visitDev("login");
  });

  it("회원가입을 클릭했을 때 회원가입 페이지로 이동하는가?", () => {
    cy.get("[data-cy=signup-link]").click();

    cy.url().should("include", "/signup");
  });

  it("로그인 성공하면 메인 페이지로 이동한다", () => {
    cy.intercept("POST", "**/v1/accounts/sign-in", {
      statusCode: 200,
      body: { accessToken: "token" },
    });

    cy.get("[data-cy=email]").type("test@test.com");
    cy.get("[data-cy=password]").type("1234");

    cy.get("[data-cy=login-btn]:visible").click();

    cy.location("pathname").should("eq", "/");
  });

  it("아이디, 비밀번호가 맞지 않을 경우 안내 문구가 뜨는가?", () => {
    cy.intercept("POST", "**/v1/accounts/sign-in", {
      statusCode: 400,
      body: {
        code: "FAILED_SIGN_IN",
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      },
    });

    cy.get("[data-cy=login-btn]:visible").click();

    cy.get("[data-cy=email-error]")
      .should("be.visible")
      .and("contain.text", "이메일을 입력해주세요");
    cy.get("[data-cy=password-error]")
      .should("be.visible")
      .and("contain.text", "비밀번호를 입력해주세요");
  });

  it("아이디 또는 비밀번호가 틀렸을 때 에러 메시지가 뜨는가?", () => {
    cy.intercept("POST", "**/v1/accounts/sign-in", {
      statusCode: 400,
      body: {
        code: "FAILED_SIGN_IN",
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      },
    });

    cy.get("[data-cy=email]").type("wrong@test.com");
    cy.get("[data-cy=password]").type("wrongpassword");
    cy.get("[data-cy=login-btn]:visible").click();

    cy.get("[data-cy=email-error]").and("contain.text", "아이디 또는 비밀번호가 올바르지 않습니다");
    cy.get("[data-cy=password-error]").and(
      "contain.text",
      "아이디 또는 비밀번호가 올바르지 않습니다"
    );
  });

  it("네트워크 에러 발생 시 에러 메시지가 뜨는가?", () => {
    cy.intercept("POST", "**/v1/accounts/sign-in", {
      forceNetworkError: true,
    });

    cy.get("[data-cy=email]").type("test@test.com");
    cy.get("[data-cy=password]").type("1234");
    cy.get("[data-cy=login-btn]:visible").click();

    cy.contains("네트워크 오류").should("be.visible");
  });
});
