# Carpasan
NAME			=	Carpasan

COMPOSE_ROUTE 	= ./docker-compose.yml

# Colours
RED				=	\033[0;31m
GREEN			=	\033[0;32m
YELLOW			=	\033[0;33m
BLUE			=	\033[0;34m
PURPLE			=	\033[0;35m
CYAN			=	\033[0;36m
WHITE			=	\033[0;37m
RESET			=	\033[0m

# Rules
all:		$(NAME)

$(NAME):	
			@printf "\n$(BLUE)==> $(CYAN)Building Carpasan 🏗️\n\n$(RESET)"
			@echo "Using compose file at $(COMPOSE_ROUTE)"
			docker-compose -f $(COMPOSE_ROUTE) build
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --remove-orphans
			@printf "\n$(BLUE)==> $(CYAN)Carpasan is running ✅\n$(RESET)"
stop:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) stop
			@printf "\n$(BLUE)==> $(RED)Carpasan stopped 🛑\n$(RESET)"

clean:		stop
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) down
			@printf "\n$(BLUE)==> $(RED)Removed Carpasan 🗑️\n$(RESET)"

fclean:		stop
			docker-compose -f $(COMPOSE_ROUTE) down --rmi all --volumes --remove-orphans
			@printf "\n$(BLUE)==> $(RED)Fully cleaned Carpasan 🗑️\n$(RESET)"

re:			clean
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --build
			@printf "$(BLUE)==> $(CYAN)Carpasan rebuilt 🔄\n$(RESET)"
			@printf "\n$(BLUE)==> $(CYAN)Carpasan is running ✅\n$(RESET)"

re-mysql:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build mysql

re-order-server:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build order-server

re-nginx:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build nginx

re-nginx-react:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build nginx-react

re-web-server:
			@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --no-deps --build web-server

.PHONY:		all stop clean fclean re
