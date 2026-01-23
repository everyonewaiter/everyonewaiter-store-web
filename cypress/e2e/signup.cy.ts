describe("Signup Flow", () => {
  it("회원가입 성공 후 로그인 페이지로 이동하는지", () => {
    cy.clock();
    cy.visitDev("signup");

    cy.intercept("POST", "**/accounts/send-auth-code", {
      statusCode: 200,
    });
    cy.intercept("POST", "**/accounts/verify-auth-code", {
      statusCode: 200,
    });
    cy.intercept("POST", "**/accounts", {
      statusCode: 200,
    });

    cy.signupForm();

    cy.url().should("include", "/signup/loading");

    // 타이머 1.5초 (1,500ms)
    cy.tick(1500);

    cy.url().should("include", "/signup/result");

    cy.tick(1000);
    cy.contains("2초 뒤 로그인 화면으로 돌아갑니다.").should("be.visible");

    cy.tick(1000);
    cy.contains("1초 뒤 로그인 화면으로 돌아갑니다.").should("be.visible");

    cy.tick(1000);
    cy.url().should("include", "/login");
  });

  describe("인증 관련 테스트", () => {
    it("휴대폰 번호 입력 후 인증요청 버튼시 활성화 되는가?", () => {
      cy.visitDev("signup");
      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 }).as("sendCode");

      cy.get("[data-cy=phoneNumber-btn]:visible").should("be.disabled");
      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");

      cy.get("[data-cy=phoneNumber-btn]:visible").should("not.be.disabled");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.wait("@sendCode").then((interception) => {
        expect(interception.request.body).to.deep.equal({
          phoneNumber: "01012341234",
        });
      });
    });

    it("인증을 누른 후, 인증 번호 박스 아래에 남은 시간이 표시 되는가?", () => {
      cy.clock();
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.get("[data-cy=authCode-time]").should("have.text", "5:00");
    });

    // 인증 번호
    it("타이머 만료 시 인증번호 입력란이 비활성화 되는가?", () => {
      cy.clock();
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });

      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.get("[data-cy=authCode]").should("not.be.disabled");

      // 타이머가 시작된 후 5분(300초 = 300000ms)
      cy.tick(300000);

      cy.get("[data-cy=phoneNumber]").should("not.be.disabled");
      cy.get("[data-cy=phoneNumber-btn]:visible").should("not.be.disabled");
      cy.get("[data-cy=authCode]").should("be.disabled");
      cy.get("[data-cy=authCode-btn]:visible").should("be.disabled");
    });

    it("올바른 인증 번호 입력시 휴대폰번호, 인증번호 칸이 비활성화 되는가?", () => {
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts/verify-auth-code", { statusCode: 200 });

      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();
      cy.get("[data-cy=authCode]").type("123123");
      cy.get("[data-cy=authCode-btn]:visible").click();

      cy.get("[data-cy=phoneNumber]").should("be.disabled");
      cy.get("[data-cy=phoneNumber-btn]").should("be.disabled");
      cy.get("[data-cy=authCode]").should("be.disabled");
      cy.get("[data-cy=authCode-btn]").should("be.disabled");
    });

    it("재인증 요청 후 타이머가 5:00부터 다시 시작되는가?", () => {
      cy.clock();
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", {
        statusCode: 200,
      });
      cy.intercept("POST", "**/accounts/verify-auth-code", {
        statusCode: 200,
      });

      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.get("[data-cy=authCode-time]").should("have.text", "5:00");

      cy.tick(30000); // 30초 (재요청 가능 시간)

      cy.get("[data-cy=authCode-time]").should("have.text", "4:30");
      cy.get("[data-cy=phoneNumber-btn]:visible").should("have.text", "재요청").click();

      cy.get("[data-cy=authCode-time]").should("have.text", "5:00");
    });
  });

  describe("에러 케이스", () => {
    it("회원가입 중 네트워크 에러 발생 시 토스트 메시지가 뜨는가?", () => {
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts/verify-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts", {
        forceNetworkError: true,
      }).as("signup");

      cy.signupForm();

      cy.wait("@signup");

      cy.contains("네트워크", { timeout: 5000 }).should("be.visible");
    });
  });
});
