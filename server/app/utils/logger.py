import logging
from colorama import Fore, Style

LOG_COLORS = {
    logging.DEBUG: Fore.BLUE + Style.BRIGHT,
    logging.INFO: Fore.GREEN + Style.BRIGHT,
    logging.WARNING: Fore.YELLOW + Style.BRIGHT,
    logging.ERROR: Fore.RED + Style.BRIGHT,
    logging.CRITICAL: Fore.RED + Style.BRIGHT + Style.BRIGHT,
}

class ColoredFormatter(logging.Formatter):
    def format(self, record):
        log_color = LOG_COLORS.get(record.levelno, "")
        reset_color = Style.RESET_ALL
        record.msg = f"{log_color}{record.msg}{reset_color}"
        return super().format(record)

logger = logging.getLogger("colored_logger")
logger.setLevel(logging.DEBUG)
logger.propagate = False

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)

formatter = ColoredFormatter("%(asctime)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)

logger.addHandler(console_handler)