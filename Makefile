# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: adpachec <adpachec@student.42madrid.com>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/05/16 11:30:04 by adpachec          #+#    #+#              #
#    Updated: 2024/05/16 11:54:38 by adpachec         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Carpasan
NAME            =   carpasan

COMPOSE_ROUTE   =   ./docker-compose.yml

# Colours
RED             =   \033[0;31m
GREEN           =   \033[0;32m
YELLOW          =   \033[0;33m
BLUE            =   \033[0;34m
PURPLE          =   \033[0;35m
CYAN            =   \033[0;36m
WHITE           =   \033[0;37m
RESET           =   \033[0m

# Rules
all:        $(NAME)

$(NAME):    
	@printf "\n$(BLUE)==> $(CYAN)Building Carpasan 🏗️\n\n$(RESET)"
	@echo "Using compose file at $(COMPOSE_ROUTE)"
	@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --remove-orphans
	@printf "\n$(BLUE)==> $(CYAN)Carpasan is running ✅\n$(RESET)"
	# @$(MAKE) cert

cert:
	@printf "\n$(BLUE)==> $(CYAN)Obtaining SSL certificate with Certbot 🔒\n\n$(RESET)"
	@docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d carpasan21.com -d www.carpasan21.com
	@printf "\n$(BLUE)==> $(CYAN)SSL certificate obtained ✅\n$(RESET)"
	@$(MAKE) restart-nginx

stop:
	@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) stop
	@printf "\n$(BLUE)==> $(RED)Carpasan stopped 🛑\n$(RESET)"

clean:	stop
	@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) down
	@printf "\n$(BLUE)==> $(RED)Removed Carpasan 🗑️\n$(RESET)"

fclean:	stop
	@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) down --rmi all --volumes --remove-orphans
	@printf "\n$(BLUE)==> $(RED)Fully cleaned Carpasan 🗑️\n$(RESET)"

re:	clean
	@docker-compose -p $(NAME) -f $(COMPOSE_ROUTE) up -d --build
	@printf "$(BLUE)==> $(CYAN)Carpasan rebuilt 🔄\n$(RESET)"
	@printf "\n$(BLUE)==> $(CYAN)Carpasan is running ✅\n$(RESET)"
	@$(MAKE) cert

restart-nginx:
	@docker-compose restart nginx
	@printf "\n$(BLUE)==> $(CYAN)Nginx restarted ✅\n$(RESET)"

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

.PHONY:     all stop clean fclean re cert restart-nginx

