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

  describe("회원가입 양식 테스트", () => {
    beforeEach(() => {
      cy.visitDev("signup");
    });

    it("이메일 양식이 맞지 않을 시 안내 문구가 뜨는가?", () => {
      cy.get("[data-cy=email]").type("test");
      cy.get("[data-cy=agreeToTerms]").click();
      cy.get("[data-cy=signup-btn]:visible").click();

      cy.get("[data-cy=email-error]").and("contain.text", "올바른 이메일 형식이 아닙니다");

      cy.get("[data-cy=email]").type("test@test.com");

      cy.get("[data-cy=email-error]").should("not.exist");
    });

    it("이미 존재하는 이메일을 기입시 안내 문구가 뜨는가?", () => {
      cy.intercept("POST", "**/accounts/send-auth-code", {
        statusCode: 200,
      });
      cy.intercept("POST", "**/accounts/verify-auth-code", {
        statusCode: 200,
      });
      cy.intercept("POST", "**/accounts", {
        statusCode: 400,
        body: { message: "이미 사용 중인 이메일입니다." },
      });

      cy.signupForm();

      cy.get("[data-cy=email-error]")
        .should("be.visible")
        .and("contain.text", "이미 사용 중인 이메일입니다.");
    });

    it("휴대폰 번호의 양식이 맞지 않을 시 안내 문구가 뜨는가?", () => {
      cy.intercept("POST", "**/accounts/send-auth-code", {
        statusCode: 400,
      });

      cy.get("[data-cy=phoneNumber]").type("1212121212");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.get("[data-cy=phoneNumber-error]").and(
        "contain.text",
        "유효하지 않은 휴대폰 번호 형식입니다."
      );
    });

    it("비밀 번호 양식이 맞지 않을 시, 안내 문구가 뜨는가?", () => {
      cy.get("[data-cy=password]").type("11");
      cy.get("[data-cy=agreeToTerms]").click();
      cy.get("[data-cy=signup-btn]:visible").click();

      cy.get("[data-cy=password-error]").and(
        "contain.text",
        "비밀번호는 영문, 숫자, 특수문자를 조합하여 8자리 이상이어야 합니다."
      );
    });

    it("비밀 번호와 비밀 번호 확인이 일치 하지 않을 시, 안내 문구가 뜨는가?", () => {
      cy.get("[data-cy=password]").type("asdf123!");
      cy.get("[data-cy=passwordConfirm]").type("asdf123!!!!");
      cy.get("[data-cy=agreeToTerms]").click();
      cy.get("[data-cy=signup-btn]:visible").click();

      cy.get("[data-cy=passwordConfirm-error]").and(
        "contain.text",
        "비밀번호가 일치하지 않습니다."
      );
    });

    it("개인정보수집에 동의하지 않을 경우, 가입하기 버튼이 비활성화 되는가?", () => {
      cy.get("[data-cy=signup-btn]:visible").should("be.disabled");
    });
  });

  describe("인증 관련 테스트", () => {
    // 휴대폰 번호
    it("휴대폰 번호 입력 후 인증요청 버튼시 활성화 되는가? 인증번호 알림톡이 오는가?", () => {
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

    // 인증 요청
    it("인증을 누른 후, 인증 번호 박스 아래에 남은 시간이 표시 되는가?", () => {
      cy.clock();
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.get("[data-cy=authCode-time]").should("have.text", "5:00");

      cy.tick(30000); // 30초, 4:30
      cy.get("[data-cy=authCode-time]").should("have.text", "4:30");

      cy.tick(30000); // 60초, 4:00
      cy.get("[data-cy=authCode-time]").should("have.text", "4:00");

      cy.tick(60000); // 120초, 3:00
      cy.get("[data-cy=authCode-time]").should("have.text", "3:00");

      cy.tick(60000); // 180초, 2:00
      cy.get("[data-cy=authCode-time]").should("have.text", "2:00");

      cy.tick(60000); // 240초, 1:00
      cy.get("[data-cy=authCode-time]").should("have.text", "1:00");

      cy.tick(60000); // 300초, 0:00
      cy.get("[data-cy=authCode-time]").should("not.exist");
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

    it("인증 번호가 맞지 않을 시, 안내 문구가 뜨는가?", () => {
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts/verify-auth-code", {
        statusCode: 400,
        body: {
          code: "UNMATCHED_VERIFICATION_CODE",
          message: "인증 번호가 일치하지 않습니다.",
        },
      });

      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.get("[data-cy=authCode]").type("123123");
      cy.get("[data-cy=authCode-btn]:visible").click();

      cy.get("[data-cy=authCode-error]").and("contain.text", "인증 번호가 일치하지 않습니다.");
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

      cy.tick(10000); // 10초 (작동 여부)

      cy.get("[data-cy=authCode-time]").should("have.text", "4:50");
    });

    it("타이머 진행 중 인증 성공 시 타이머가 없어지는가?", () => {
      cy.clock();
      cy.visitDev("signup");

      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts/verify-auth-code", { statusCode: 200 });

      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.tick(60000); // 1분
      cy.get("[data-cy=authCode-time]").should("have.text", "4:00");

      cy.get("[data-cy=authCode]").type("123123");
      cy.get("[data-cy=authCode-btn]:visible").click();

      cy.get("[data-cy=authCode-time]").should("not.exist");
    });
  });

  describe("에러 케이스", () => {
    beforeEach(() => {
      cy.visitDev("signup");
    });

    it("회원가입 중 네트워크 에러 발생 시 토스트 메시지가 뜨는가?", () => {
      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts/verify-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts", {
        forceNetworkError: true,
      }).as("signup");

      cy.signupForm();

      cy.wait("@signup");

      cy.contains("네트워크", { timeout: 5000 }).should("be.visible");
    });

    it("인증 요청 시 429 에러 발생 안내 문구가 뜨는지?", () => {
      cy.intercept("POST", "**/accounts/send-auth-code", {
        statusCode: 429,
        body: {
          message: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
        },
      }).as("sendCode");

      cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
      cy.get("[data-cy=phoneNumber-btn]:visible").click();

      cy.wait("@sendCode");

      cy.get("[data-cy=phoneNumber-error]").and(
        "contain.text",
        "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    });

    it("회원가입 시 429 에러 발생 시 토스트 메시지가 뜨는가?", () => {
      cy.intercept("POST", "**/accounts/send-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts/verify-auth-code", { statusCode: 200 });
      cy.intercept("POST", "**/accounts", {
        statusCode: 429,
        body: {
          message: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
        },
      }).as("signup");

      cy.signupForm();

      cy.wait("@signup");

      cy.contains("너무 많은 요청이 발생했습니다").should("be.visible");
    });
  });
});
