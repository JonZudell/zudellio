import logging
import os
import json

log_levels = {
    "debug": logging.DEBUG,
    "info": logging.INFO,
    "warning": logging.WARNING,
    "error": logging.ERROR,
    "critical": logging.CRITICAL,
}

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "filename": record.filename,
            "lineno": record.lineno,
            "funcName": record.funcName,
        }
        return json.dumps(log_record)

def setup_logging(name: str) -> logging.Logger:
    logging.basicConfig(
        level=log_levels[os.environ.get("LOG_LEVEL", "INFO").lower()],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    logger = logging.getLogger(name)
    logger.setLevel(log_levels[os.environ.get("LOG_LEVEL", "INFO").lower()])
    # Avoid adding multiple handlers
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
    return logger

class SingletonLogger:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SingletonLogger, cls).__new__(cls, *args, **kwargs)
            cls._instance.logger = setup_logging("singleton_logger")
        return cls._instance

def get_logger_adapter(extra: dict) -> logging.LoggerAdapter:
    singleton_logger = SingletonLogger().logger
    return logging.LoggerAdapter(singleton_logger, extra)